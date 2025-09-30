<?php
// login.php

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
  // Remove next line if you don't use cookies:
  header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Max-Age: 86400');

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

// ---- Connect DB (db.php must be silent) ----
try {
  require __DIR__ . '/db.php';
} catch (Throwable $e) {
  jerr(500, 'DB connect failed', ['error' => $e->getMessage()]);
}

// ---- Parse JSON ----
$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
  jerr(400, 'Invalid JSON');
}

$email    = trim($payload['email'] ?? '');
$password = (string)($payload['password'] ?? '');

if ($email === '' || $password === '') {
  jerr(422, 'Email and password are required');
}

// ---- Lookup user by email ----
try {
  $stmt = $pdo->prepare('SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1');
  $stmt->execute([$email]);
  $user = $stmt->fetch();

  // Generic error message to avoid user enumeration
  if (!$user || !password_verify($password, $user['password_hash'])) {
    jerr(401, 'Invalid credentials');
  }

  // Optional: rehash if needed (future-proof)
  if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
    $newHash = password_hash($password, PASSWORD_DEFAULT);
    $upd = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $upd->execute([$newHash, $user['id']]);
  }

  // Session expiry (frontend stores this)
  $expiresAt = gmdate('c', time() + 7 * 24 * 60 * 60); // ISO 8601, 7 days

  http_response_code(200);
  echo json_encode([
    'success'     => true,
    'message'     => 'Login successful',
    'user'        => [
      'id'    => (int)$user['id'],
      'name'  => $user['name'],
      'email' => $user['email'],
    ],
    'expires_at'  => $expiresAt,
    // If you later add JWT, include 'token' here
  ]);
  exit;

} catch (PDOException $e) {
  jerr(500, 'Database error'); // keep generic for production
}
