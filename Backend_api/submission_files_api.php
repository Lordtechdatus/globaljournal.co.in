<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://globaljournal.co.in');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

try {
  require_once __DIR__ . '/db.php';
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Database connection failed']);
  exit;
}

// Ensure a tiny side-table exists for statuses (since submission_files has no status column)
$ddl = "
CREATE TABLE IF NOT EXISTS `submission_file_status` (
  `file_id` INT NOT NULL,
  `status`  VARCHAR(32) NOT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`file_id`),
  CONSTRAINT `fk_sfs_file` FOREIGN KEY (`file_id`) REFERENCES `submission_files`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
";
$pdo->exec($ddl);

// Fetch files with left-joined status
$sql = "
SELECT
  sf.id,
  sf.submission_id,
  sf.original_name,
  sf.stored_name,
  sf.size,
  sf.type,
  sf.author_name,
  sf.created_at,
  sfs.status
FROM submission_files sf
LEFT JOIN submission_file_status sfs ON sfs.file_id = sf.id
ORDER BY sf.created_at DESC, sf.id DESC
";
$stmt = $pdo->query($sql);
$rows = $stmt->fetchAll();

$out = [];
foreach ($rows as $r) {
  // Title: derive from original_name without extension; fallback to stored_name
  $rawName = $r['original_name'] ?: $r['stored_name'] ?: '';
  $title   = $rawName;
  if ($title !== '') {
    $title = preg_replace('/\.[A-Za-z0-9]+$/', '', $title); // strip extension
  }
  if ($title === '' || $title === null) {
    $title = 'Untitled';
  }

  // Author
  $author = $r['author_name'] ?: 'Not Assigned';

  // Date -> ISO8601 for reliable parsing in JS
  $uploadIso = null;
  if (!empty($r['created_at'])) {
    try { $uploadIso = (new DateTime((string)$r['created_at']))->format(DATE_ATOM); }
    catch (Throwable $e) { $uploadIso = (string)$r['created_at']; }
  }

  // Status default
  $status = $r['status'] ?: 'pending';

  $out[] = [
    'id'         => (int)$r['id'],
    'title'      => $title,
    'author'     => $author,
    'fileName'   => $r['original_name'] ?: $r['stored_name'] ?: '',
    'uploadDate' => $uploadIso,
    'status'     => $status,
  ];
}

echo json_encode(['success' => true, 'data' => $out], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
