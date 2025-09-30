<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
// Update as needed for your admin origin:
header('Access-Control-Allow-Origin: https://globaljournal.co.in');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  echo json_encode(['success' => false, 'error' => 'Method not allowed']);
  exit;
}

try {
  require_once __DIR__ . '/db.php'; // provides $pdo
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Database connection failed']);
  exit;
}

// Optional query params (all optional; frontend doesn’t need to send these)
// ?q=searchTerm      (matches title, author)
// ?status=pending    (approved|pending|rejected)
// ?limit=100&offset=0
$q       = isset($_GET['q']) ? trim((string)$_GET['q']) : '';
$status  = isset($_GET['status']) ? strtolower(trim((string)$_GET['status'])) : '';
$limit   = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
$offset  = isset($_GET['offset']) ? max(0, (int)$_GET['offset']) : 0;
if ($limit !== null) $limit = max(1, min(1000, $limit));

$params = [];
$where  = [];

// Base select: join users to resolve submitted_by -> users.name
$sql = "SELECT 
          t.id,
          t.title,
          t.submitted_by,
          t.status,
          t.created_at AS submitted_date_raw,
          u.name AS author_name
        FROM title t
        LEFT JOIN users u ON u.id = t.submitted_by";

// Filtering
if ($q !== '') {
  // Match title or author name
  $where[] = "(t.title LIKE :q OR u.name LIKE :q)";
  $params[':q'] = "%{$q}%";
}
if (in_array($status, ['approved','pending','rejected'], true)) {
  $where[] = "LOWER(t.status) = :status";
  $params[':status'] = $status;
}
if ($where) {
  $sql .= " WHERE " . implode(" AND ", $where);
}

// Order newest first
$sql .= " ORDER BY t.created_at DESC, t.id DESC";

// Pagination
if ($limit !== null) {
  $sql .= " LIMIT {$limit} OFFSET {$offset}";
}

try {
  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  $rows = $stmt->fetchAll();

  $out = [];
  foreach ($rows as $r) {
    // Author
    $author = $r['author_name'] ?: 'Unknown';

    // submitted_by should be a string for your frontend filters; prefer name, else raw id
    $submittedByStr = $r['author_name'];
    if ($submittedByStr === null || $submittedByStr === '') {
      // Fall back to the numeric id as string
      $submittedByStr = isset($r['submitted_by']) ? (string)$r['submitted_by'] : 'Unknown';
    }

    // Date -> ISO8601 (so your JS can parse reliably)
    $submittedDate = null;
    if (!empty($r['submitted_date_raw'])) {
      try {
        $submittedDate = (new DateTime((string)$r['submitted_date_raw']))->format(DATE_ATOM);
      } catch (Throwable $e) {
        $submittedDate = (string)$r['submitted_date_raw'];
      }
    }

    // Status (pass through; default to 'pending' if empty)
    $status = $r['status'] ?: 'pending';

    $out[] = [
      'id'              => (int)$r['id'],
      'title'           => (string)$r['title'],
      'author'          => $author,
      'submitted_by'    => $submittedByStr,  // string for your .toLowerCase() filters
      'submitted_date'  => $submittedDate,
      'status'          => (string)$status,
    ];
  }

  // Your React expects a plain array (no wrapper)
  echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Query failed']);
}
