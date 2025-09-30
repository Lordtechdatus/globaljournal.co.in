<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
// Adjust to match your frontend origin(s)
header('Access-Control-Allow-Origin: https://globaljournal.co.in');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  echo json_encode(['success' => false, 'error' => 'Method not allowed']);
  exit;
}

// Bring in $pdo
try {
  require_once __DIR__ . '/db.php';
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Database connection failed']);
  exit;
}

/**
 * Helpers
 */
function tableExists(PDO $pdo, string $table): bool {
  $stmt = $pdo->prepare("SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :t LIMIT 1");
  $stmt->execute([':t' => $table]);
  return (bool) $stmt->fetchColumn();
}

function getColumns(PDO $pdo, string $table): array {
  $stmt = $pdo->prepare("SHOW COLUMNS FROM `$table`");
  $stmt->execute();
  $cols = [];
  foreach ($stmt->fetchAll() as $row) {
    $cols[] = $row['Field'];
  }
  return $cols;
}

function pickCol(array $cols, array $candidates, ?string $default = null): ?string {
  foreach ($candidates as $c) {
    if (in_array($c, $cols, true)) return $c;
  }
  return $default;
}

try {
  // Prefer `newsubmissions`, else fallback to `submissions`
  $table = null;
  if (tableExists($pdo, 'newsubmissions')) {
    $table = 'newsubmissions';
  } elseif (tableExists($pdo, 'submissions')) {
    $table = 'submissions';
  } else {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'No submissions table found']);
    exit;
  }

  $cols = getColumns($pdo, $table);

  // Map likely columns
  $colId     = pickCol($cols, ['id', 'submission_id', 'ns_id'], 'id');
  $colTitle  = pickCol($cols, ['title', 'paper_title', 'manuscript_title'], null);
  $colUserId = pickCol($cols, ['user_id', 'author_id'], null);
  $colAuthor = pickCol($cols, ['author', 'author_name', 'submitted_by'], null);
  $colDate   = pickCol($cols, ['submission_date', 'submitted_at', 'created_at', 'createdOn', 'createdon'], null);
  $colStatus = pickCol($cols, ['status', 'state', 'current_status'], null);

  // Build SELECT with optional LEFT JOIN users if user_id is present
  $selects = [];
  $joins   = '';
  $params  = [];

  // id (required-ish; fallback to 0)
  $selects[] = $colId ? "`$table`.`$colId` AS id" : "0 AS id";

  // title
  $selects[] = $colTitle ? "`$table`.`$colTitle` AS title" : "'' AS title";

  // author: prefer users.name if user_id exists, otherwise a native author column
  if ($colUserId && tableExists($pdo, 'users')) {
    $selects[] = "COALESCE(`users`.`name`, " . ($colAuthor ? "`$table`.`$colAuthor`" : "NULL") . ") AS author";
    $joins .= " LEFT JOIN `users` ON `users`.`id` = `$table`.`$colUserId`";
  } elseif ($colAuthor) {
    $selects[] = "`$table`.`$colAuthor` AS author";
  } else {
    $selects[] = "NULL AS author";
  }

  // submissionDate: normalize to ISO 8601 in PHP after fetch
  $selects[] = $colDate ? "`$table`.`$colDate` AS submissionDate_raw" : "NULL AS submissionDate_raw";

  // status
  $selects[] = $colStatus ? "`$table`.`$colStatus` AS status" : "NULL AS status";

  $sql = "SELECT " . implode(", ", $selects) . " FROM `$table` $joins";

  // Order by date desc when available, else id desc
  if ($colDate) {
    $sql .= " ORDER BY `$table`.`$colDate` DESC";
  } elseif ($colId) {
    $sql .= " ORDER BY `$table`.`$colId` DESC";
  }

  // Optional lightweight pagination (limit/offset)
  $limit  = isset($_GET['limit']) ? (int)$_GET['limit'] : 0;
  $offset = isset($_GET['offset']) ? max(0, (int)$_GET['offset']) : 0;
  if ($limit > 0) {
    $limit = min($limit, 1000);
    $sql  .= " LIMIT $limit OFFSET $offset";
  }

  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  $rows = $stmt->fetchAll();

  // Normalize to frontend shape
  $out = [];
  foreach ($rows as $r) {
    // Title
    $title = isset($r['title']) && $r['title'] !== '' ? $r['title'] : 'Untitled';

    // Author
    $author = $r['author'] ?? null;
    if ($author === null || $author === '') {
      $author = 'Unknown';
    }

    // Date -> keep string for UI; convert to ISO-8601 if it looks like a datetime
    $submissionDate = null;
    if (!empty($r['submissionDate_raw'])) {
      try {
        $dt = new DateTime($r['submissionDate_raw']);
        // You can switch to a localized format if you prefer, e.g. 'M d, Y'
        $submissionDate = $dt->format(DATE_ATOM);
      } catch (Throwable $e) {
        $submissionDate = (string)$r['submissionDate_raw'];
      }
    } else {
      $submissionDate = '';
    }

    // Status
    $status = $r['status'] ?? null;
    if ($status === null || $status === '') {
      $status = 'Pending Review';
    }

    $out[] = [
      'id'             => (int)($r['id'] ?? 0),
      'title'          => $title,
      'author'         => $author,
      'submissionDate' => $submissionDate,
      'status'         => $status,
    ];
  }

  echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Query failed']);
}
