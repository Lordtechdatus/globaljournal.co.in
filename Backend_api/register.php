<?php
// ---- CORS (top of file) ----
$ALLOWED_ORIGINS = [
  'https://globaljournal.co.in',
  'https://www.globaljournal.co.in',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $ALLOWED_ORIGINS, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header('Vary: Origin');
  header('Access-Control-Allow-Credentials: true'); // remove if not using cookies
}
header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Max-Age: 86400'); // cache preflight

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

// ---- Helper to emit JSON errors ----
function jerr(int $code, string $msg, array $extra = []): void {
  http_response_code($code);
  echo json_encode(['success' => false, 'message' => $msg] + $extra);
  exit;
}

// ---- Connect DB (catch connection errors too) ----
try {
  require __DIR__ . '/db.php'; // MUST be silent
} catch (Throwable $e) {
  jerr(500, 'DB connect failed', ['error' => $e->getMessage()]);
}

// ---- Parse JSON ----
$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
  jerr(400, 'Invalid JSON');
}

// ---- Extract fields ----
$username    = trim($payload['username'] ?? '');
$email       = trim($payload['email'] ?? '');
$password    = (string)($payload['password'] ?? '');
$name        = trim($payload['name'] ?? '');
$affiliation = trim($payload['affiliation'] ?? '');
$country     = trim($payload['country'] ?? '');
$phoneDigits = preg_replace('/\D+/', '', (string)($payload['phonenumber'] ?? '')); // your table uses "phonenumber"
$orcidId     = trim((string)($payload['orcidId'] ?? '')) ?: null;
$areas       = trim((string)($payload['areasOfInterest'] ?? '')) ?: null;
$agree       = (int)!!($payload['agreeToPrivacy'] ?? false);

// ---- Validation (align with your needs) ----
$errors = [];
if ($username === '') $errors['username'] = 'Required';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Invalid email';
if (strlen($password) < 8) $errors['password'] = 'Min 8 characters';
if ($name === '') $errors['name'] = 'Required';
if ($affiliation === '') $errors['affiliation'] = 'Required';
if ($country === '') $errors['country'] = 'Required';
if ($phoneDigits === '' || !preg_match('/^\d{10}$/', $phoneDigits)) $errors['phonenumber'] = 'Phone must be exactly 10 digits';
if (!$agree) $errors['agreeToPrivacy'] = 'Must accept privacy policy';

if ($errors) {
  jerr(422, 'Validation failed', ['errors' => $errors]);
}

// ---- SQL work (catch PDO errors and show message TEMPORARILY) ----
try {
  // Duplicate check
  $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1');
  $stmt->execute([$email, $username]);
  if ($stmt->fetch()) {
    jerr(409, 'User already exists');
  }

  // Insert
 $hash = password_hash($password, PASSWORD_DEFAULT);

  // NOTE: Your current table has column "phonenumber" (not "phone"), and no "created_ip".
  $stmt = $pdo->prepare('INSERT INTO users
  (username, email, password_hash, name, affiliation, country, phone, orcid_id, areas_of_interest, agree_to_privacy)
  VALUES (?,?,?,?,?,?,?,?,?,?)');

  $stmt->execute([
  $username, $email, $hash, $name, $affiliation, $country, $phoneDigits, $orcidId, $areas, $agree
]);

  http_response_code(201);
  echo json_encode(['success' => true, 'message' => 'User registered successfully']);
  exit;
} catch (PDOException $e) {
  jerr(500, 'SQL error', [
    'error' => $e->getMessage(),
    'info'  => $e->errorInfo ?? null
  ]);
}
