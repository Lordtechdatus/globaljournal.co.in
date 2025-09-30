<?php
// ================== dashboard-stats.php ==================
// Returns counts for the admin dashboard without breaking if a table is missing.
// Keys: users, titles, new_submissions, reports, submission_files, contributors
// =========================================================

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
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

try {
  require_once __DIR__ . '/db.php';
  if (!($pdo instanceof PDO)) throw new RuntimeException('DB not initialized.');
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

  $tableExists = function(string $t) use ($pdo): bool {
    $q = $pdo->prepare("SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = :t LIMIT 1");
    $q->execute([':t' => $t]);
    return (bool)$q->fetchColumn();
  };
  $countTable = function(string $t) use ($pdo, $tableExists): int {
    if (!$tableExists($t)) return 0;
    $stmt = $pdo->query("SELECT COUNT(*) FROM `$t`");
    return (int)$stmt->fetchColumn();
  };

  // Counts
  $users            = $countTable('users');                 // users
  $titles           = $tableExists('title') ? $countTable('title') : ($tableExists('titles') ? $countTable('titles') : 0);
  // Prefer 'newsubmissions' for "new_submissions" if it exists; else fall back to 'submissions'
  $new_submissions  = $tableExists('newsubmissions') ? $countTable('newsubmissions') : ($tableExists('submissions') ? $countTable('submissions') : 0);
  $reports          = $countTable('reports');
  $submission_files = $tableExists('submission_files') ? $countTable('submission_files') : 0;
  $contributors     = $tableExists('contributors') ? $countTable('contributors') : ($tableExists('submission_contributors') ? $countTable('submission_contributors') : 0);

  echo json_encode([
    'users'            => $users,
    'titles'           => $titles,
    'new_submissions'  => $new_submissions,
    'reports'          => $reports,
    'submission_files' => $submission_files,
    'contributors'     => $contributors,
  ]);
  exit;

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Server error: '.$e->getMessage()]);
  exit;
}
