<?php
// ========================== reset.php ==========================
// Actions:
//   POST ?action=request   { email }            -> generate token + send email
//   GET  ?action=verify&token=...              -> validate token (optional use)
//   POST ?action=reset     { token, password } -> update password
// ===============================================================

/* ---- CORS ---- */
$allowed_origins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://globaljournal.co.in',
  'https://www.globaljournal.co.in',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowed_origins, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header('Access-Control-Allow-Credentials: true');
  header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
  http_response_code(204);
  exit;
}

/* ---- Config ---- */
const FRONTEND_RESET_URL = 'https://globaljournal.co.in/set-password';

// SMTP (cPanel)
$MAIL = [
  'method'     => 'smtp',
  'host'       => 'mail.globaljournal.co.in',
  'port'       => 465,
  'secure'     => 'ssl',
  'username'   => 'no-reply@globaljournal.co.in',
  'password'   => 'Kamalsharma@264', // TODO: put real mailbox password
  'from_email' => 'no-reply@globaljournal.co.in',
  'from_name'  => 'Global Journal',
];

// PHPMailer autoload if present
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
  require_once __DIR__ . '/vendor/autoload.php';
}

/* ---- DB ---- */
require_once __DIR__ . '/db.php';
if (!($pdo instanceof PDO)) {
  http_response_code(500);
  echo json_encode(['success'=>false,'message'=>'DB not initialized']);
  exit;
}
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

/* ---- Helpers ---- */
$tableExists = function(string $t) use ($pdo): bool {
  $q = $pdo->prepare("SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = :t LIMIT 1");
  $q->execute([':t'=>$t]);
  return (bool)$q->fetchColumn();
};
$colExists = function(string $t, string $c) use ($pdo): bool {
  $q = $pdo->prepare("SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = :t AND column_name = :c LIMIT 1");
  $q->execute([':t'=>$t, ':c'=>$c]);
  return (bool)$q->fetchColumn();
};

function pickName(array $row): string {
  foreach (['first_name','firstname','given_name'] as $k1) {
    foreach (['last_name','lastname','family_name'] as $k2) {
      if (!empty($row[$k1]) || !empty($row[$k2])) {
        return trim(($row[$k1] ?? '').' '.($row[$k2] ?? ''));
      }
    }
  }
  foreach (['username','name'] as $k) { if (!empty($row[$k])) return (string)$row[$k]; }
  return (string)($row['email'] ?? '');
}

/* ---- Mail sender ---- */
function sendResetEmail(array $MAIL, string $toEmail, string $toName, string $link): bool {
  $subject = 'Reset your Global Journal password';
  $html = '<div style="font-family:Arial,sans-serif;line-height:1.5">
    <p>Hi '.htmlspecialchars($toName ?: $toEmail).',</p>
    <p>We received a request to reset your password. Click the button below:</p>
    <p><a href="'.htmlspecialchars($link).'" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Reset Password</a></p>
    <p>Or copy this link into your browser:</p>
    <p><code>'.htmlspecialchars($link).'</code></p>
    <p>This link will expire in 1 hour. If you didn’t request this, you can safely ignore this email.</p>
    <p style="margin-top:24px">— Global Journal</p>
  </div>';

  if (class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
      if ($MAIL['method'] === 'smtp') {
        $mail->isSMTP();
        $mail->Host       = $MAIL['host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $MAIL['username'];
        $mail->Password   = $MAIL['password'];
        $mail->SMTPSecure = ($MAIL['secure'] === 'ssl')
          ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
          : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $MAIL['port'];
      }
      $mail->setFrom($MAIL['from_email'], $MAIL['from_name']);
      $mail->addAddress($toEmail, $toName ?: $toEmail);
      $mail->isHTML(true);
      $mail->Subject = $subject;
      $mail->Body    = $html;
      $mail->AltBody = "Open this link to reset your password:\n".$link;
      return $mail->send();
    } catch (Throwable $e) {
      // fall through
    }
  }

  // Fallback mail()
  $headers  = "MIME-Version: 1.0\r\n";
  $headers .= "Content-type:text/html; charset=UTF-8\r\n";
  $headers .= "From: {$MAIL['from_name']} <{$MAIL['from_email']}>\r\n";
  return @mail($toEmail, $subject, $html, $headers);
}

/* ---- Routing ---- */
$action = $_GET['action'] ?? 'reset';

try {
  /* verify */
  if ($action === 'verify') {
    $token = isset($_GET['token']) ? trim((string)$_GET['token']) : '';
    if ($token === '') { http_response_code(422); echo json_encode(['success'=>false,'message'=>'Missing token']); exit; }
    $stmt = $pdo->prepare("SELECT user_id, expiry FROM password_reset_tokens WHERE token = :t LIMIT 1");
    $stmt->execute([':t'=>$token]);
    $row = $stmt->fetch();
    if (!$row) { http_response_code(404); echo json_encode(['success'=>false,'message'=>'Invalid token']); exit; }
    if (strtotime((string)$row['expiry']) <= time()) { http_response_code(410); echo json_encode(['success'=>false,'message'=>'Token expired']); exit; }
    echo json_encode(['success'=>true]); exit;
  }

  /* request */
  if ($action === 'request') {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
      http_response_code(405);
      echo json_encode(['success'=>false,'message'=>'Method not allowed']);
      exit;
    }
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    $email = isset($data['email']) ? trim((string)$data['email']) : '';
    if ($email === '') { http_response_code(422); echo json_encode(['success'=>false,'message'=>'Email is required']); exit; }

    $userId = null; $displayName = '';

    // USERS: select * (avoid unknown columns)
    if ($tableExists('users') && $colExists('users','email')) {
      $u = $pdo->prepare("SELECT * FROM users WHERE email = :e LIMIT 1");
      $u->execute([':e'=>$email]);
      if ($row = $u->fetch()) {
        $userId = (int)$row['id'];
        $displayName = pickName($row);
        if ($displayName === '' && !empty($row['email'])) $displayName = (string)$row['email'];
      }
    }

    // ADMINS fallback
    if ($userId === null && $tableExists('admins') && $colExists('admins','email')) {
      $a = $pdo->prepare("SELECT * FROM admins WHERE email = :e LIMIT 1");
      $a->execute([':e'=>$email]);
      if ($row = $a->fetch()) {
        $userId = (int)$row['id'];
        $displayName = pickName($row);
        if ($displayName === '' && !empty($row['name']))  $displayName = (string)$row['name'];
        if ($displayName === '' && !empty($row['email'])) $displayName = (string)$row['email'];
      }
    }

    // Always return success (no enumeration). Only send if found.
    if ($userId !== null) {
      // cleanup old/expired
      $pdo->prepare("DELETE FROM password_reset_tokens WHERE user_id = :uid OR expiry < NOW()")
          ->execute([':uid'=>$userId]);

      $token  = rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
      $expiry = date('Y-m-d H:i:s', time() + 3600);

      $ins = $pdo->prepare("INSERT INTO password_reset_tokens (user_id, token, expiry, created_at) VALUES (:uid, :t, :exp, NOW())");
      $ins->execute([':uid'=>$userId, ':t'=>$token, ':exp'=>$expiry]);

      $link = FRONTEND_RESET_URL . '?token=' . urlencode($token);
      @sendResetEmail($MAIL, $email, $displayName, $link);
    }

    echo json_encode(['success'=>true, 'message'=>'If an account with that email exists, a reset link has been sent.']);
    exit;
  }

  /* reset */
  if ($action === 'reset') {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
      http_response_code(405);
      echo json_encode(['success'=>false,'message'=>'Method not allowed']);
      exit;
    }
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid JSON']); exit; }

    $token    = isset($data['token'])    ? trim((string)$data['token']) : '';
    $password = isset($data['password']) ? (string)$data['password']   : '';
    if ($token === '' || $password === '') { http_response_code(422); echo json_encode(['success'=>false,'message'=>'Missing token or password']); exit; }
    if (strlen($password) < 8) { http_response_code(422); echo json_encode(['success'=>false,'message'=>'Password must be at least 8 characters']); exit; }

    $stmt = $pdo->prepare("SELECT id, user_id, expiry FROM password_reset_tokens WHERE token = :t LIMIT 1");
    $stmt->execute([':t'=>$token]);
    $tok = $stmt->fetch();
    if (!$tok) { http_response_code(404); echo json_encode(['success'=>false,'message'=>'Invalid token']); exit; }
    if (strtotime((string)$tok['expiry']) <= time()) { http_response_code(410); echo json_encode(['success'=>false,'message'=>'Token expired']); exit; }

    $userId = (int)$tok['user_id'];

    // Decide table + password column
    $targetTable = null; $passColumn = null; $updateCols = [];
    if ($tableExists('users')) {
      $u = $pdo->prepare("SELECT id FROM users WHERE id = :id LIMIT 1");
      $u->execute([':id'=>$userId]);
      if ($u->fetch()) { $targetTable = 'users'; }
    }
    if (!$targetTable && $tableExists('admins')) {
      $a = $pdo->prepare("SELECT id FROM admins WHERE id = :id LIMIT 1");
      $a->execute([':id'=>$userId]);
      if ($a->fetch()) { $targetTable = 'admins'; }
    }
    if (!$targetTable) { http_response_code(404); echo json_encode(['success'=>false,'message'=>'User not found']); exit; }

    foreach (['password_hash','password','pass','pwd'] as $c) {
      if ($colExists($targetTable,$c)) { $passColumn = $c; break; }
    }
    if (!$passColumn) { http_response_code(500); echo json_encode(['success'=>false,'message'=>'No password column found']); exit; }

    if ($colExists($targetTable,'updated_at')) $updateCols[] = 'updated_at = NOW()';
    if ($targetTable === 'admins' && $colExists('admins','last_password_reset')) $updateCols[] = 'last_password_reset = NOW()';

    $pdo->beginTransaction();
    $hash = password_hash($password, PASSWORD_BCRYPT);

    $sql = "UPDATE `$targetTable` SET `$passColumn` = :p";
    if (!empty($updateCols)) $sql .= ", ".implode(', ', $updateCols);
    $sql .= " WHERE id = :id LIMIT 1";
    $upd = $pdo->prepare($sql);
    $upd->execute([':p'=>$hash, ':id'=>$userId]);

    $del = $pdo->prepare("DELETE FROM password_reset_tokens WHERE id = :tid");
    $del->execute([':tid'=>(int)$tok['id']]);

    $pdo->commit();

    echo json_encode(['success'=>true, 'message'=>'Password has been reset.']);
    exit;
  }

  // Unknown
  http_response_code(400);
  echo json_encode(['success'=>false,'message'=>'Unknown action']);

} catch (Throwable $e) {
  // Centralized error -> helpful during setup
  http_response_code(500);
  echo json_encode(['success'=>false,'message'=>'Server error: '.$e->getMessage()]);
}
