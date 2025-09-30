<?php
// ================== make_submission.php (schema-aligned & resilient) ==================
// - submissions: uses title/abstract/keywords/editor_comments/feedback/status='pending'
// - article_id set to NULL (FK safe) — ensure column allows NULL
// - submission_files: dynamically maps columns (stored_name/file_type/file_size/created_at vs type/size/author_name)
// - contributors: uses 'contributors' table if present
// ==========================================================================

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
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }
header('Content-Type: application/json; charset=utf-8');

// ---- Read JSON ----
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
  http_response_code(400);
  echo json_encode(['success'=>false,'message'=>'Invalid JSON']); exit;
}

// Required
$title        = trim((string)($data['title'] ?? ''));
$abstract     = trim((string)($data['abstract'] ?? ''));
$submitted_by = (int)($data['submitted_by'] ?? 0);

// Optional
$keywords       = $data['keywords'] ?? []; // array ya string
$editorComments = trim((string)($data['editorComments'] ?? ''));
$files          = is_array($data['files'] ?? null) ? $data['files'] : [];
$contributors   = is_array($data['contributors'] ?? null) ? $data['contributors'] : [];

// Validate
if ($title === '' || $abstract === '' || $submitted_by <= 0) {
  http_response_code(422);
  echo json_encode(['success'=>false,'message'=>'Missing required fields (title, abstract, submitted_by)']);
  exit;
}

// keywords -> TEXT/CSV
if (is_array($keywords)) {
  $keywords = implode(',', array_filter(array_map('trim', $keywords), fn($k)=>$k!==''));
} else {
  $keywords = trim((string)$keywords);
}

try {
  require_once __DIR__ . '/db.php';
  if (!($pdo instanceof PDO)) { throw new RuntimeException('DB not initialized'); }
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

  $pdo->beginTransaction();

  // Insert submission (match your schema)
  // status enum ('pending','approved','rejected') -> we use 'pending'
  // article_id = NULL (FK safe if column allows NULL)
  $stmt = $pdo->prepare(
    "INSERT INTO submissions
      (article_id, submitted_by, status, feedback, title, abstract, keywords, editor_comments, created_at, updated_at)
     VALUES
      (:article_id, :submitted_by, :status, :feedback, :title, :abstract, :keywords, :editor_comments, NOW(), NOW())"
  );

  // If you want to *force* PDO NULL type: bindValue example
  // $stmt->bindValue(':article_id', null, PDO::PARAM_NULL);
  // ...but array execute with PHP null is fine too.
  $stmt->execute([
    ':article_id'      => null,
    ':submitted_by'    => $submitted_by,
    ':status'          => 'pending',
    ':feedback'        => $editorComments, // 'feedback' me editor comments rakh rahe
    ':title'           => $title,
    ':abstract'        => $abstract,
    ':keywords'        => $keywords,
    ':editor_comments' => $editorComments,
  ]);
  $submissionId = (int)$pdo->lastInsertId();

  // Insert files (dynamic mapping to your schema)
  if ($hasTable('submission_files') && !empty($files)) {

    // Column availability
    $col_stored   = $hasColumn('submission_files','stored_name');     // preferred
    $col_filetype = $hasColumn('submission_files','file_type');       // preferred
    $col_filesize = $hasColumn('submission_files','file_size');       // preferred
    $col_type     = $hasColumn('submission_files','type');            // fallback
    $col_size     = $hasColumn('submission_files','size');            // fallback
    $col_author   = $hasColumn('submission_files','author_name');     // can use for stored_name fallback or author
    $col_created  = $hasColumn('submission_files','created_at');      // optional timestamp

    foreach ($files as $f) {
      $originalName = (string)($f['name'] ?? '');
      $storedName   = (string)($f['serverFileName'] ?? ''); // from upload.php
      $fileType     = (string)($f['type'] ?? '');
      $fileSize     = (string)($f['size'] ?? '');
      $authorName   = (string)($f['authorName'] ?? '');     // optional from client

      // we need at least a stored file name to link to disk file
      if ($storedName === '') { continue; }

      $cols = ['submission_id', 'original_name'];
      $phs  = [':submission_id', ':original_name'];
      $par  = [':submission_id'=>$submissionId, ':original_name'=>$originalName];

      // stored file name -> prefer stored_name, else use author_name as fallback
      if ($col_stored) {
        $cols[]='stored_name'; $phs[]=':stored_name'; $par[':stored_name']=$storedName;
      } elseif ($col_author) {
        // fallback: store serverFileName into author_name (so we can delete later)
        $cols[]='author_name'; $phs[]=':author_name'; $par[':author_name']=$storedName;
      }

      // file type -> prefer file_type else type
      if ($col_filetype) {
        $cols[]='file_type'; $phs[]=':file_type'; $par[':file_type']=$fileType;
      } elseif ($col_type) {
        $cols[]='type'; $phs[]=':type'; $par[':type']=$fileType;
      }

      // file size -> prefer file_size else size
      if ($col_filesize) {
        $cols[]='file_size'; $phs[]=':file_size'; $par[':file_size']=$fileSize;
      } elseif ($col_size) {
        $cols[]='size'; $phs[]=':size'; $par[':size']=$fileSize;
      }

      // if we still have a separate author_name column and didn't use it for fallback, store actual authorName (optional)
      if ($col_author && !$col_stored) {
        // already used author_name for storedName fallback — skip extra
      } elseif ($col_author && $authorName !== '') {
        $cols[]='author_name'; $phs[]=':author_name_real'; $par[':author_name_real']=$authorName;
      }

      // created_at if exists
      if ($col_created) {
        $cols[]='created_at'; $phs[]=':created_at'; $par[':created_at']=date('Y-m-d H:i:s');
      }

      $sql = "INSERT INTO submission_files (".implode(',', $cols).") VALUES (".implode(',', $phs).")";
      $stmtFile = $pdo->prepare($sql);
      $stmtFile->execute($par);
    }
  }

  // Insert contributors (use 'contributors' table if present)
  if ($hasTable('contributors') && !empty($contributors)) {
    // Assume columns: id, submission_id, name, affiliation, role, created_at
    $stmtContrib = $pdo->prepare(
      "INSERT INTO contributors
        (submission_id, name, affiliation, role, created_at)
       VALUES
        (:submission_id, :name, :affiliation, :role, NOW())"
    );
    foreach ($contributors as $c) {
      $name = trim((string)($c['name'] ?? ''));
      if ($name !== '') {
        $stmtContrib->execute([
          ':submission_id' => $submissionId,
          ':name'          => $name,
          ':affiliation'   => trim((string)($c['affiliation'] ?? '')),
          ':role'          => trim((string)($c['role'] ?? '')),
        ]);
      }
    }
  }

  $pdo->commit();

  $nowIso = date('c');
  echo json_encode([
    'success' => true,
    'message' => 'Submission saved',
    'submission' => [
      'id'            => $submissionId,
      'title'         => $title,
      'abstract'      => $abstract,
      'keywords'      => array_filter(array_map('trim', explode(',', $keywords))),
      'status'        => 'pending',
      'submitted_by'  => $submitted_by,
      'createdAt'     => $nowIso,
      'updatedAt'     => $nowIso,
    ]
  ]);
  exit;

} catch (Throwable $e) {
  if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) { $pdo->rollBack(); }
  http_response_code(500);
  echo json_encode(['success'=>false,'message'=>'Server error: '.$e->getMessage()]);
  exit;
}
