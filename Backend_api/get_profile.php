<?php
// get_profile.php

// ---- CORS ----
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
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

function jerr(int $code, string $msg, array $extra = []): void {
  http_response_code($code);
  echo json_encode(['success' => false, 'message' => $msg] + $extra);
  exit;
}

// ---- DB ----
try {
  require __DIR__ . '/db.php'; // silent
} catch (Throwable $e) {
  jerr(500, 'DB connect failed');
}

// ---- Input ----
$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) jerr(400, 'Invalid JSON');

// You can look up by email OR id. (Email is easiest since you stored it after login.)
$email = trim($payload['email'] ?? '');
$id    = isset($payload['id']) ? (int)$payload['id'] : 0;

if ($email === '' && $id <= 0) {
  jerr(422, 'Provide email or id');
}

try {
  if ($email !== '') {
    $stmt = $pdo->prepare('SELECT id, username, email, name, affiliation, country, phone, orcid_id, areas_of_interest, agree_to_privacy, created_at
                           FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
  } else {
    $stmt = $pdo->prepare('SELECT id, username, email, name, affiliation, country, phone, orcid_id, areas_of_interest, agree_to_privacy, created_at
                           FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
  }

  $u = $stmt->fetch();
  if (!$u) jerr(404, 'User not found');

  // Split name into given/family (best-effort)
  $given = $u['name'];
  $family = '';
  if (strpos($u['name'], ' ') !== false) {
    $parts = preg_split('/\s+/', $u['name'], -1, PREG_SPLIT_NO_EMPTY);
    $given = array_shift($parts);
    $family = implode(' ', $parts);
  }

  // Normalize shape for your MyProfile mapping
  $resp = [
    'id'                 => (int)$u['id'],
    'username'           => $u['username'] ?? '',
    'email'              => $u['email'] ?? '',
    'name'               => $u['name'] ?? '',
    'givenName'          => $given,
    'familyName'         => $family,
    'affiliation'        => $u['affiliation'] ?? '',
    'country'            => $u['country'] ?? '',
    'phonenumber'        => $u['phone'] ?? '',
    'orcidId'            => $u['orcid_id'] ?? '',
    // areas_of_interest: DB stores as TEXT (comma sep); UI expects array
    'areas_of_interest'  => $u['areas_of_interest'] ?? null,
    'researchInterests'  => isset($u['areas_of_interest']) && $u['areas_of_interest'] !== null
                              ? array_values(array_filter(array_map('trim', explode(',', $u['areas_of_interest']))))
                              : [],
    'createdAt'          => $u['created_at'] ?? null,
    'agreeToPrivacy'     => (bool)$u['agree_to_privacy'],
  ];

  echo json_encode(['success' => true, 'data' => $resp]);
  exit;

} catch (PDOException $e) {
  jerr(500, 'Database error');
}
