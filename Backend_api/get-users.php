<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
// Adjust to your frontend origin(s). For dev, you can temporarily use "*".
header('Access-Control-Allow-Origin: https://globaljournal.co.in');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  echo json_encode(['success' => false, 'error' => 'Method not allowed']);
  exit;
}

// Use shared PDO ($pdo) from db.php
try {
  require_once __DIR__ . '/db.php';
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Database connection failed']);
  exit;
}

// ---- Inputs & validation ----
$allowedSort = ['name', 'email', 'affiliation', 'country', 'created_at', 'id'];

$search = isset($_GET['q']) ? trim((string)$_GET['q']) : '';
$sort   = isset($_GET['sort']) ? (string)$_GET['sort'] : 'name';
$dir    = isset($_GET['dir']) && strtolower((string)$_GET['dir']) === 'desc' ? 'DESC' : 'ASC';
if (!in_array($sort, $allowedSort, true)) {
  $sort = 'name';
}

$limit  = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
$offset = max(0, $offset);
if ($limit !== null) {
  $limit = max(1, min(1000, $limit));
}

// ---- Build SQL ----
$sql = "SELECT id, name, email, affiliation, country, created_at
        FROM users";
$params = [];

if ($search !== '') {
  $sql .= " WHERE name LIKE :q
            OR email LIKE :q
            OR COALESCE(affiliation, '') LIKE :q
            OR COALESCE(country, '') LIKE :q";
  $params[':q'] = "%{$search}%";
}

$sql .= " ORDER BY {$sort} {$dir}";

// Safely append LIMIT/OFFSET after validating ints (no binding needed)
if ($limit !== null) {
  $sql .= " LIMIT {$limit} OFFSET {$offset}";
}

try {
  $stmt = $pdo->prepare($sql);

  if ($search !== '') {
    $stmt->bindValue(':q', $params[':q'], PDO::PARAM_STR);
  }

  $stmt->execute();
  $rows = $stmt->fetchAll();

  // Normalize/clean output
  foreach ($rows as &$u) {
    // Ensure optional fields are null instead of empty strings
    $u['affiliation'] = isset($u['affiliation']) && $u['affiliation'] !== '' ? $u['affiliation'] : null;
    $u['country']     = isset($u['country']) && $u['country'] !== '' ? $u['country'] : null;

    // Convert created_at to ISO-8601 (e.g. 2025-09-24T10:34:34+05:30)
    if (!empty($u['created_at'])) {
      try {
        $dt = new DateTime($u['created_at']); // assumes server timezone; adjust if needed
        $u['created_at'] = $dt->format(DATE_ATOM);
      } catch (Throwable $e) {
        // leave as-is if parsing fails
      }
    }
  }
  unset($u);

  echo json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Query failed']);
}
