<?php
// ======================= upload.php =======================
// CORS (origins edit karein)
// - Accepts multipart/form-data with "file"
// - Validates type/size
// - Saves to ./uploads and returns server file name
// ==========================================================

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

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
  http_response_code(204);
  exit;
}

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

if (!isset($_FILES['file'])) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'No file uploaded']);
  exit;
}

$file = $_FILES['file'];
if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Upload error: ' . ($file['error'] ?? 'unknown')]);
  exit;
}

// ---- Validation ----
$allowedExtensions = ['doc', 'docx', 'pdf'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowedExtensions, true)) {
  http_response_code(415);
  echo json_encode(['success' => false, 'message' => 'Invalid file type']);
  exit;
}

$maxBytes = 50 * 1024 * 1024; // 50MB
if (($file['size'] ?? 0) > $maxBytes) {
  http_response_code(413);
  echo json_encode(['success' => false, 'message' => 'File too large']);
  exit;
}

// ---- Save ----
$destDir = __DIR__ . '/uploads';
if (!is_dir($destDir)) {
  if (!mkdir($destDir, 0775, true) && !is_dir($destDir)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to create uploads directory']);
    exit;
  }
}

$uniqueName = uniqid('file_', true) . '.' . $ext;
$destPath = $destDir . '/' . $uniqueName;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Failed to save file']);
  exit;
}

echo json_encode([
  'success'   => true,
  'fileName'  => $uniqueName,       // store this in DB as stored_name
  'origName'  => $file['name'] ?? '',// optional, for display
  'mime'      => $file['type'] ?? '',
  'size'      => (int)($file['size'] ?? 0),
]);
