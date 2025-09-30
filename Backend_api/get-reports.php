<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://globaljournal.co.in');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'GET') { http_response_code(405); echo json_encode(['success'=>false,'error'=>'Method not allowed']); exit; }

try { require_once __DIR__ . '/db.php'; }
catch (Throwable $e) { http_response_code(500); echo json_encode(['success'=>false,'error'=>'Database connection failed']); exit; }

function tableExists(PDO $pdo, string $t): bool {
  $s=$pdo->prepare("SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :t LIMIT 1");
  $s->execute([':t'=>$t]); return (bool)$s->fetchColumn();
}

try {
  if (!tableExists($pdo, 'reports')) { http_response_code(404); echo json_encode(['success'=>false,'error'=>'reports table not found']); exit; }
  if (!tableExists($pdo, 'users'))   { /* join optional; continue without users */ }

  // Base query: reports + optional users.name
  $sql = "SELECT r.report_id   AS id,
                 r.user_id     AS user_id,
                 r.file_name   AS file_name,
                 r.created_at  AS created_at,
                 " . (tableExists($pdo,'users') ? "u.name AS author_name" : "NULL AS author_name") . "
          FROM reports r
          " . (tableExists($pdo,'users') ? "LEFT JOIN users u ON u.id = r.user_id" : "") . "
          ORDER BY r.created_at DESC, r.report_id DESC";

  $st = $pdo->prepare($sql);
  $st->execute();
  $rows = $st->fetchAll();

  $out = [];
  foreach ($rows as $r) {
    $file = (string)$r['file_name'];
    // Derive a friendly title: remove extension & leading prefixes like "report_20250714_161838_"
    $base = preg_replace('/\.[A-Za-z0-9]+$/', '', $file);              // strip extension
    $title = preg_replace('/^report_\d{8}_\d{6}_/i', '', $base);       // common pattern
    if ($title === '' || $title === null) { $title = $base ?: 'Untitled'; }

    // Author
    $author = $r['author_name'] ?? null;
    if (!$author || $author === '') $author = 'Unknown';

    // Date -> ISO
    $dateIso = null;
    if (!empty($r['created_at'])) {
      try { $dateIso = (new DateTime((string)$r['created_at']))->format(DATE_ATOM); }
      catch (Throwable $e) { $dateIso = (string)$r['created_at']; }
    }

    $out[] = [
      'id'         => (int)$r['id'],
      'title'      => $title,
      'author'     => $author,
      'type'       => 'research',   // no type column; set a sensible default
      'status'     => 'published',  // make download button visible in your UI
      'views'      => 0,
      'downloads'  => 0,
      'date'       => $dateIso,
      'description'=> null,
    ];
  }

  echo json_encode($out, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success'=>false,'error'=>'Query failed']);
}
