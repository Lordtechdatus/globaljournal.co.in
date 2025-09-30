<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://globaljournal.co.in');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

$input = json_decode(file_get_contents('php://input'), true);
$fileId = isset($input['fileId']) ? (int)$input['fileId'] : 0;
$status = isset($input['status']) ? trim((string)$input['status']) : '';

$allowed = ['pending', 'approved', 'rejected', 'under review'];
if ($fileId <= 0 || $status === '' || !in_array(strtolower($status), $allowed, true)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Invalid fileId or status']);
  exit;
}

// Ensure side-table exists (same as in list endpoint)
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

// Verify the file exists
$chk = $pdo->prepare("SELECT 1 FROM submission_files WHERE id = :id");
$chk->execute([':id' => $fileId]);
if (!$chk->fetchColumn()) {
  http_response_code(404);
  echo json_encode(['success' => false, 'message' => 'File not found']);
  exit;
}

// Upsert status
$sql = "
INSERT INTO submission_file_status (file_id, status)
VALUES (:id, :status)
ON DUPLICATE KEY UPDATE status = VALUES(status), updated_at = CURRENT_TIMESTAMP
";
$st = $pdo->prepare($sql);
$st->execute([':id' => $fileId, ':status' => $status]);

echo json_encode(['success' => true]);
