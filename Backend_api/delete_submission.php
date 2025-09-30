<?php
// =================== delete_submission.php (resilient) ===================
// - CORS + preflight
// - Input: JSON { "submissionId": number }
// - Deletes submission_files, contributors/submission_contributors, submissions
// - Deletes physical files using stored_name if present; else author_name; else original_name
// =========================================================================

$allowed_origins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://globaljournal.co.in',
  'https://www.globaljournal.co.in'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowed_origins, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header('Access-Control-Allow-Credentials: true');
  header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
$submissionId = isset($data['submissionId']) ? (int)$data['submissionId'] : 0;

if ($submissionId <= 0) {
  http_response_code(422);
  echo json_encode(['success' => false, 'message' => 'Invalid submission id']);
  exit;
}

try {
  require_once __DIR__ . '/db.php';
  if (!($pdo instanceof PDO)) {
    throw new RuntimeException('Database connection not initialized.');
  }
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

  // helpers
  $hasTable = function(string $table) use ($pdo): bool {
    $q = $pdo->prepare("SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = :t LIMIT 1");
    $q->execute([':t'=>$table]);
    return (bool)$q->fetchColumn();
  };
  $hasColumn = function(string $table, string $col) use ($pdo): bool {
    $q = $pdo->prepare("SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = :t AND column_name = :c LIMIT 1");
    $q->execute([':t'=>$table, ':c'=>$col]);
    return (bool)$q->fetchColumn();
  };

  $uploadsDir = __DIR__ . '/uploads';

  $pdo->beginTransaction();

  // --- 1) Gather file names to delete from disk (after commit) ---
  $filesCol = 'original_name'; // default safest
  if ($hasColumn('submission_files', 'stored_name')) {
    $filesCol = 'stored_name';
  } elseif ($hasColumn('submission_files', 'author_name')) {
    // we used author_name as fallback store for serverFileName in make_submission.php
    $filesCol = 'author_name';
  }

  $stmtGetFiles = $pdo->prepare("SELECT {$filesCol} AS fname FROM submission_files WHERE submission_id = :sid");
  $stmtGetFiles->execute([':sid' => $submissionId]);
  $storedFiles = $stmtGetFiles->fetchAll();

  // --- 2) Delete child rows first ---
  if ($hasTable('submission_files')) {
    $pdo->prepare('DELETE FROM submission_files WHERE submission_id = :sid')->execute([':sid' => $submissionId]);
  }

  // contributors table name may vary
  if ($hasTable('contributors')) {
    $pdo->prepare('DELETE FROM contributors WHERE submission_id = :sid')->execute([':sid' => $submissionId]);
  } elseif ($hasTable('submission_contributors')) {
    $pdo->prepare('DELETE FROM submission_contributors WHERE submission_id = :sid')->execute([':sid' => $submissionId]);
  }

  // --- 3) Delete submission row ---
  $pdo->prepare('DELETE FROM submissions WHERE id = :sid')->execute([':sid' => $submissionId]);

  $pdo->commit();

  // --- 4) Delete physical files (best effort, post-commit) ---
  if (!empty($storedFiles) && is_dir($uploadsDir)) {
    foreach ($storedFiles as $row) {
      $name = trim((string)($row['fname'] ?? ''));
      if ($name !== '') {
        $path = $uploadsDir . '/' . $name;
        if (is_file($path)) {
          @unlink($path); // ignore errors
        }
      }
    }
  }

  echo json_encode(['success' => true]);
  exit;

} catch (Throwable $e) {
  if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
    $pdo->rollBack();
  }
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
  exit;
}
