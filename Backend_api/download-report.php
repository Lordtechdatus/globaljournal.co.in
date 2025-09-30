<?php
declare(strict_types=1);

header('Access-Control-Allow-Origin: https://globaljournal.co.in');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

try { require_once __DIR__ . '/db.php'; }
catch (Throwable $e) { http_response_code(500); echo 'Database connection failed'; exit; }

function tableExists(PDO $pdo, string $t): bool {
  $s=$pdo->prepare("SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :t LIMIT 1");
  $s->execute([':t'=>$t]); return (bool)$s->fetchColumn();
}

if (!tableExists($pdo,'reports')) { http_response_code(404); echo 'reports table not found'; exit; }

// Base uploads directory: backend/uploads
$baseDir = __DIR__ . '/uploads';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Your frontend posts after download to bump counters; no counter column exists, so ACK success.
  $input = json_decode(file_get_contents('php://input'), true) ?? [];
  $reportId = isset($input['reportId']) ? (int)$input['reportId'] : 0;
  if ($reportId <= 0) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'Invalid reportId']); exit; }
  echo json_encode(['success'=>true]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
  if ($id <= 0) { http_response_code(400); echo 'Missing id'; exit; }

  // Fetch the report row
  $sql = "SELECT report_id AS id, file_name FROM reports WHERE report_id = :id LIMIT 1";
  $st  = $pdo->prepare($sql);
  $st->execute([':id'=>$id]);
  $row = $st->fetch();
  if (!$row) { http_response_code(404); echo 'Report not found'; exit; }

  $filename = trim((string)$row['file_name']);
  if ($filename === '') { http_response_code(404); echo 'File name not set'; exit; }

  // Resolve path: if absolute, use as-is; else resolve against backend/uploads
  $candidate = $filename;
  $path = (strpos($candidate, DIRECTORY_SEPARATOR) === 0 || preg_match('#^[A-Za-z]:\\\\#',$candidate))
            ? $candidate
            : $baseDir . '/' . ltrim($candidate, '/\\');

  if (!is_file($path) || !is_readable($path)) {
    http_response_code(404);
    echo 'File not found on server';
    exit;
  }

  $filesize = filesize($path);
  $ext      = pathinfo($path, PATHINFO_EXTENSION) ?: 'docx';

  // Create a download-friendly name from file_name
  $safeTitle = preg_replace('/\.[A-Za-z0-9]+$/', '', basename($filename));
  $safeTitle = preg_replace('/^report_\d{8}_\d{6}_/i', '', $safeTitle);
  $safeTitle = preg_replace('/[^A-Za-z0-9_\-]+/', '_', $safeTitle) ?: 'report';
  $downloadName = $safeTitle . '.' . $ext;

  header('Content-Description: File Transfer');
  header('Content-Type: application/octet-stream');
  header('Content-Disposition: attachment; filename="'. $downloadName .'"');
  header('Content-Transfer-Encoding: binary');
  header('Content-Length: ' . $filesize);
  header('Cache-Control: private, max-age=0, must-revalidate');
  header('Pragma: public');

  $fp = fopen($path, 'rb');
  if ($fp) {
    while (!feof($fp)) {
      echo fread($fp, 8192);
      @ob_flush(); flush();
    }
    fclose($fp);
  }
  exit;
}

http_response_code(405);
echo 'Method not allowed';
