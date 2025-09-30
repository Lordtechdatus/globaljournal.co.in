<?php
// ===== admin_login.php (for admins: id,name,email,password,created_at) =====
$allowed = ['http://localhost:3000','http://127.0.0.1:3000','https://globaljournal.co.in','https://www.globaljournal.co.in'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin,$allowed,true)) { header("Access-Control-Allow-Origin: $origin"); header('Access-Control-Allow-Credentials: true'); header('Vary: Origin'); }
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

// Health check for axios.get(...)
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
  echo json_encode(['ok' => true, 'message' => 'Admin login endpoint alive']);
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') { http_response_code(405); echo json_encode(['success'=>false,'message'=>'Method not allowed']); exit; }

// Read JSON
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
$email = isset($data['email']) ? trim((string)$data['email']) : '';
$pass  = isset($data['password']) ? (string)$data['password'] : '';
if ($email === '' || $pass === '') { http_response_code(422); echo json_encode(['success'=>false,'message'=>'Email and password are required.']); exit; }

try {
  require_once __DIR__ . '/db.php';
  if (!($pdo instanceof PDO)) throw new RuntimeException('Database connection not initialized.');
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

  $stmt = $pdo->prepare("SELECT id, name, email, password, created_at FROM admins WHERE email = :email LIMIT 1");
  $stmt->execute([':email'=>$email]);
  $row = $stmt->fetch();
  if (!$row) { http_response_code(401); echo json_encode(['success'=>false,'message'=>'Invalid email or password.']); exit; }

  $ok = password_verify($pass, (string)$row['password']);
  if (!$ok) { http_response_code(401); echo json_encode(['success'=>false,'message'=>'Invalid email or password.']); exit; }

  if (session_status() === PHP_SESSION_NONE) { session_start(); }
  $_SESSION['admin_logged_in'] = true;
  $_SESSION['admin_id'] = (int)$row['id'];

  // Optional: update last_login if column exists (won't error if missing)
  try { $pdo->query("UPDATE admins SET last_login = NOW() WHERE id = ".(int)$row['id']); } catch (Throwable $__) {}

  echo json_encode([
    'success' => true,
    'user' => [
      'id'         => (int)$row['id'],
      'name'       => (string)$row['name'],
      'email'      => (string)$row['email'],
      'created_at' => (string)$row['created_at'],
      // last_login may not exist; frontend already handles "Not available"
    ]
  ]);
  exit;

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success'=>false,'message'=>'Server error: '.$e->getMessage()]);
  exit;
}
