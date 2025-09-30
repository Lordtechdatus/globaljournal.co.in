<?php
// ================== recent-activity.php ==================
// Returns a merged, date-sorted list of recent items across tables.
// Each item: { type, message, created_at }
// Types used: 'user', 'submission', 'file', 'report', 'title', 'contributor'
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
  $colExists = function(string $t, string $c) use ($pdo): bool {
    $q = $pdo->prepare("SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = :t AND column_name = :c LIMIT 1");
    $q->execute([':t' => $t, ':c' => $c]);
    return (bool)$q->fetchColumn();
  };
  $firstExistingCol = function(string $t, array $candidates) use ($colExists): ?string {
    foreach ($candidates as $c) if ($colExists($t, $c)) return $c;
    return null;
  };

  $activities = [];
  $limitPerTable = 10;

  // Helper to push standardized items
  $push = function(array &$arr, string $type, string $message, ?string $dt) {
    // Normalize date/time to ISO if possible
    $created = $dt ?: null;
    if ($created) {
      // leave string as-is; sorting will use strtotime
    }
    $arr[] = ['type' => $type, 'message' => $message, 'created_at' => $created];
  };

  // USERS
  if ($tableExists('users')) {
    $t = 'users';
    $idCol   = $firstExistingCol($t, ['id']);
    $emailCol= $firstExistingCol($t, ['email','mail']);
    $userCol = $firstExistingCol($t, ['username','user_name','name']);
    $dateCol = $firstExistingCol($t, ['created_at','createdAt','created','updated_at','updatedAt','date']);
    $cols = array_filter([$idCol,$emailCol,$userCol,$dateCol]);
    if (!empty($cols)) {
      $sql = "SELECT ".implode(',', array_map(fn($c)=>"`$c` AS `$c`", $cols))." FROM `$t`".
             ($dateCol ? " ORDER BY `$dateCol` DESC" : "").
             " LIMIT $limitPerTable";
      $rs = $pdo->query($sql)->fetchAll();
      foreach ($rs as $r) {
        $label = $r[$emailCol] ?? $r[$userCol] ?? ('ID '.$r[$idCol]);
        $push($activities, 'user', "New user registered: ".$label, $dateCol ? ($r[$dateCol] ?? null) : null);
      }
    }
  }

  // SUBMISSIONS (prefer 'submissions'; also look at 'newsubmissions')
  $submissionTables = [];
  if ($tableExists('submissions')) $submissionTables[] = ['submissions','submission'];
  if ($tableExists('newsubmissions')) $submissionTables[] = ['newsubmissions','submission'];

  foreach ($submissionTables as [$t,$type]) {
    $idCol    = $firstExistingCol($t, ['id']);
    $titleCol = $firstExistingCol($t, ['title']);
    $statusCol= $firstExistingCol($t, ['status']);
    $dateCol  = $firstExistingCol($t, ['updated_at','updatedAt','created_at','createdAt','date']);
    $cols = array_filter([$idCol,$titleCol,$statusCol,$dateCol]);
    if (!empty($cols)) {
      $sql = "SELECT ".implode(',', array_map(fn($c)=>"`$c` AS `$c`", $cols))." FROM `$t`".
             ($dateCol ? " ORDER BY `$dateCol` DESC" : "").
             " LIMIT $limitPerTable";
      $rs = $pdo->query($sql)->fetchAll();
      foreach ($rs as $r) {
        $label = $r[$titleCol] ?? ('ID '.$r[$idCol]);
        $status= $statusCol ? (' ['.($r[$statusCol] ?? '').']') : '';
        $push($activities, $type, "Submission created: ".$label.$status, $dateCol ? ($r[$dateCol] ?? null) : null);
      }
    }
  }

  // SUBMISSION FILES
  if ($tableExists('submission_files')) {
    $t = 'submission_files';
    $origCol = $firstExistingCol($t, ['original_name','file_name','name']);
    $stored  = $firstExistingCol($t, ['stored_name','author_name']); // we stored serverFileName in one of these
    $dateCol = $firstExistingCol($t, ['created_at','uploaded_at','date']);
    $cols = array_filter([$origCol,$stored,$dateCol]);
    if (!empty($cols)) {
      $sql = "SELECT ".implode(',', array_map(fn($c)=>"`$c` AS `$c`", $cols))." FROM `$t`".
             ($dateCol ? " ORDER BY `$dateCol` DESC" : "").
             " LIMIT $limitPerTable";
      $rs = $pdo->query($sql)->fetchAll();
      foreach ($rs as $r) {
        $name = $r[$origCol] ?? $r[$stored] ?? 'file';
        $push($activities, 'file', "File uploaded: ".$name, $dateCol ? ($r[$dateCol] ?? null) : null);
      }
    }
  }

  // CONTRIBUTORS
  $contribTable = $tableExists('contributors') ? 'contributors' : ($tableExists('submission_contributors') ? 'submission_contributors' : null);
  if ($contribTable) {
    $t = $contribTable;
    $nameCol = $firstExistingCol($t, ['name']);
    $affCol  = $firstExistingCol($t, ['affiliation']);
    $dateCol = $firstExistingCol($t, ['created_at','date']);
    $cols = array_filter([$nameCol,$affCol,$dateCol]);
    if (!empty($cols)) {
      $sql = "SELECT ".implode(',', array_map(fn($c)=>"`$c` AS `$c`", $cols))." FROM `$t`".
             ($dateCol ? " ORDER BY `$dateCol` DESC" : "").
             " LIMIT $limitPerTable";
      $rs = $pdo->query($sql)->fetchAll();
      foreach ($rs as $r) {
        $label = $r[$nameCol] ?? 'Contributor';
        $aff   = $affCol && !empty($r[$affCol]) ? (' ('.$r[$affCol].')') : '';
        $push($activities, 'contributor', "Contributor added: ".$label.$aff, $dateCol ? ($r[$dateCol] ?? null) : null);
      }
    }
  }

  // REPORTS
  if ($tableExists('reports')) {
    $t = 'reports';
    $idCol   = $firstExistingCol($t, ['id']);
    $titleCol= $firstExistingCol($t, ['title','subject']);
    $dateCol = $firstExistingCol($t, ['created_at','date','reported_at']);
    $cols = array_filter([$idCol,$titleCol,$dateCol]);
    if (!empty($cols)) {
      $sql = "SELECT ".implode(',', array_map(fn($c)=>"`$c` AS `$c`", $cols))." FROM `$t`".
             ($dateCol ? " ORDER BY `$dateCol` DESC" : "").
             " LIMIT $limitPerTable";
      $rs = $pdo->query($sql)->fetchAll();
      foreach ($rs as $r) {
        $label = $r[$titleCol] ?? ('ID '.$r[$idCol]);
        $push($activities, 'report', "Report filed: ".$label, $dateCol ? ($r[$dateCol] ?? null) : null);
      }
    }
  }

  // TITLES
  $titleTable = $tableExists('title') ? 'title' : ($tableExists('titles') ? 'titles' : null);
  if ($titleTable) {
    $t = $titleTable;
    $idCol   = $firstExistingCol($t, ['id']);
    $nameCol = $firstExistingCol($t, ['title','name']);
    $dateCol = $firstExistingCol($t, ['created_at','date','updated_at']);
    $cols = array_filter([$idCol,$nameCol,$dateCol]);
    if (!empty($cols)) {
      $sql = "SELECT ".implode(',', array_map(fn($c)=>"`$c` AS `$c`", $cols))." FROM `$t`".
             ($dateCol ? " ORDER BY `$dateCol` DESC" : "").
             " LIMIT $limitPerTable";
      $rs = $pdo->query($sql)->fetchAll();
      foreach ($rs as $r) {
        $label = $r[$nameCol] ?? ('ID '.$r[$idCol]);
        $push($activities, 'title', "Title created: ".$label, $dateCol ? ($r[$dateCol] ?? null) : null);
      }
    }
  }

  // Merge + sort desc by created_at
  usort($activities, function($a, $b) {
    $ta = isset($a['created_at']) ? strtotime($a['created_at']) : 0;
    $tb = isset($b['created_at']) ? strtotime($b['created_at']) : 0;
    return $tb <=> $ta;
  });

  // Cap total items (feel free to change to 20/30)
  $activities = array_slice($activities, 0, 20);

  echo json_encode($activities);
  exit;

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Server error: '.$e->getMessage()]);
  exit;
}
