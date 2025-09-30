<?php
// ================ get_submissions.php =================
$allowed_origins = [
  'http://localhost:3000','http://127.0.0.1:3000',
  'https://globaljournal.co.in','https://www.globaljournal.co.in'
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
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }
header('Content-Type: application/json; charset=utf-8');

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
$submitted_by = (int)($body['submitted_by'] ?? 0);

try {
  require_once __DIR__ . '/db.php';
  if (!($pdo instanceof PDO)) { throw new RuntimeException('DB not initialized'); }
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

  $sql = "SELECT id, title, abstract, keywords, status, submitted_by, created_at, updated_at
          FROM submissions
          WHERE (:uid = 0 OR submitted_by = :uid)
          ORDER BY updated_at DESC";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([':uid'=>$submitted_by]);
  $rows = $stmt->fetchAll();

  $subs = array_map(function($r){
    $kw = trim((string)($r['keywords'] ?? ''));
    $arr = $kw !== '' ? array_filter(array_map('trim', explode(',', $kw))) : [];
    return [
      'id'           => (int)$r['id'],
      'title'        => $r['title'] ?? 'No title',
      'abstract'     => (string)($r['abstract'] ?? ''),
      'keywords'     => $arr,
      'status'       => $r['status'] ?? 'pending',
      'submitted_by' => (int)($r['submitted_by'] ?? 0),
      'createdAt'    => $r['created_at'] ?? null,
      'updatedAt'    => $r['updated_at'] ?? null,
    ];
  }, $rows);

  echo json_encode(['success'=>true,'submissions'=>$subs]);
  exit;

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success'=>false,'message'=>'Server error: '.$e->getMessage()]);
  exit;
}
