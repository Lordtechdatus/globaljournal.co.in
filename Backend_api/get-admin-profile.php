<?php
// ================= get-admin-profile.php =================
$allowed = ['http://localhost:3000','http://127.0.0.1:3000','https://globaljournal.co.in','https://www.globaljournal.co.in'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin,$allowed,true)) { header("Access-Control-Allow-Origin: $origin"); header('Access-Control-Allow-Credentials: true'); header('Vary: Origin'); }
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

if (session_status() === PHP_SESSION_NONE) { session_start(); }
if (empty($_SESSION['admin_logged_in']) || empty($_SESSION['admin_id'])) {
  http_response_code(401);
  echo json_encode(['success'=>false,'message'=>'Not logged in']);
  exit;
}
$adminId = (int)$_SESSION['admin_id'];

try {
  require_once __DIR__ . '/db.php';
  if (!($pdo instanceof PDO)) throw new RuntimeException('Database connection not initialized.');
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

  // Try to include last_login if present; fallback query if column missing
  $row = null;
  try {
    $stmt = $pdo->prepare("SELECT id, name, email, created_at, last_login FROM admins WHERE id = :id LIMIT 1");
    $stmt->execute([':id'=>$adminId]);
    $row = $stmt->fetch();
  } catch (Throwable $__) {
    $stmt = $pdo->prepare("SELECT id, name, email, created_at FROM admins WHERE id = :id LIMIT 1");
    $stmt->execute([':id'=>$adminId]);
    $row = $stmt->fetch();
    $row['last_login'] = null;
  }

  if (!$row) { http_response_code(404); echo json_encode(['success'=>false,'message'=>'Admin not found']); exit; }

  echo json_encode([
    'success' => true,
    'user' => [
      'id'         => (int)$row['id'],
      'name'       => (string)$row['name'],
      'email'      => (string)$row['email'],
      'created_at' => (string)$row['created_at'],
      'last_login' => $row['last_login'] ?? null,
    ]
  ]);
  exit;

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success'=>false,'message'=>'Server error: '.$e->getMessage()]);
  exit;
}
