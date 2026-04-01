<?php
/**
 * AviatorTutor Classes Browse Page
 */

use App\Lib\Database;

$title = "Browse Classes - AviatorTutor";
$description = "Find the perfect training for your aviation career. Join group sessions, webinars, and ground schools.";

// Parse search params
$queryParam = $_GET['q'] ?? null;
$authority = $_GET['authority'] ?? "ALL";
$standard = $_GET['standard'] ?? "ALL";
$airline = $_GET['airline'] ?? "ALL";
$category = $_GET['category'] ?? "ALL";
$type = $_GET['type'] ?? "ALL";

try {
    $db = Database::getInstance();
    
    // Fetch Airlines for filter
    $db->query("SELECT id, name, country FROM airlines ORDER BY name ASC");
    $airlines = $db->resultSet();
    
    // Construct MySQL Query
    $sql = "SELECT c.*, u.name as instructor_name, a.name as airline_name,
            (SELECT COUNT(*) FROM bookings b WHERE b.class_id = c.id) as booking_count
            FROM classes c
            JOIN instructor_profiles ip ON c.instructor_id = ip.id
            JOIN users u ON ip.user_id = u.id
            LEFT JOIN airlines a ON ip.airline_id = a.id
            WHERE c.status = 'PUBLISHED' ";
    
    $params = [];
    
    if ($queryParam) {
        $sql .= " AND (c.title LIKE :q OR u.name LIKE :q) ";
        $params['q'] = '%' . $queryParam . '%';
    }
    
    if ($authority !== "ALL") {
        $sql .= " AND c.authority = :authority ";
        $params['authority'] = $authority;
    }
    
    if ($standard !== "ALL") {
        $sql .= " AND c.authority_standard = :standard ";
        $params['standard'] = $standard;
    }
    
    if ($airline !== "ALL") {
        $sql .= " AND ip.airline_id = :airline ";
        $params['airline'] = $airline;
    }
    
    if ($type !== "ALL") {
        $sql .= " AND c.type = :type ";
        $params['type'] = $type;
    }
    
    // Handle category (tags JSON)
    if ($category !== "ALL") {
        $sql .= " AND (JSON_CONTAINS(c.tags, JSON_QUOTE(:category)) OR c.title LIKE :cat_search) ";
        $params['category'] = $category;
        $params['cat_search'] = '%' . $category . '%';
    }
    
    $sql .= " ORDER BY c.created_at DESC";
    
    $db->query($sql);
    foreach ($params as $key => $val) {
        $db->bind($key, $val);
    }
    
    $classes = $db->resultSet();
    
} catch (\Exception $e) {
    error_log($e->getMessage());
    $classes = [];
    $airlines = [];
}

ob_start();
?>

<div class="container mx-auto px-4 py-8 space-y-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Browse Classes</h1>
            <p class="text-muted-foreground mt-1">Find the perfect training for your aviation career</p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1 space-y-6">
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="p-6 space-y-6">
                    <form action="/classes" method="GET" class="space-y-6">
                        <div class="space-y-2">
                            <h3 class="font-semibold text-sm flex items-center gap-2">
                                <i data-lucide="search" class="h-4 w-4"></i> Search
                            </h3>
                            <input
                                name="q"
                                placeholder="Search by keyword..."
                                value="<?php echo htmlspecialchars($queryParam ?? ''); ?>"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <hr class="border-t" />

                        <div class="space-y-4">
                            <h3 class="font-semibold text-sm flex items-center gap-2">
                                <i data-lucide="sliders-horizontal" class="h-4 w-4"></i> Filters
                            </h3>

                            <div class="space-y-1">
                                <label class="text-xs font-medium text-muted-foreground uppercase">Authority</label>
                                <select name="authority" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full appearance-none">
                                    <option value="ALL">All Authorities</option>
                                    <option value="FAA" <?php echo $authority === 'FAA' ? 'selected' : ''; ?>>FAA (USA)</option>
                                    <option value="EASA" <?php echo $authority === 'EASA' ? 'selected' : ''; ?>>EASA (Europe)</option>
                                    <option value="CAA" <?php echo $authority === 'CAA' ? 'selected' : ''; ?>>CAA (UK)</option>
                                </select>
                            </div>

                            <div class="space-y-1">
                                <label class="text-xs font-medium text-muted-foreground uppercase">Standard</label>
                                <select name="standard" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full appearance-none">
                                    <option value="ALL">All Standards</option>
                                    <option value="ICAO" <?php echo $standard === 'ICAO' ? 'selected' : ''; ?>>ICAO</option>
                                    <option value="FAA" <?php echo $standard === 'FAA' ? 'selected' : ''; ?>>FAA</option>
                                    <option value="EASA" <?php echo $standard === 'EASA' ? 'selected' : ''; ?>>EASA</option>
                                    <option value="IATA" <?php echo $standard === 'IATA' ? 'selected' : ''; ?>>IATA</option>
                                </select>
                            </div>

                            <div class="space-y-1">
                                <label class="text-xs font-medium text-muted-foreground uppercase">Airline</label>
                                <select name="airline" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full appearance-none">
                                    <option value="ALL">All Airlines</option>
                                    <?php foreach ($airlines as $a): ?>
                                        <option value="<?php echo $a['id']; ?>" <?php echo $airline === $a['id'] ? 'selected' : ''; ?>>
                                            <?php echo $a['name']; ?> (<?php echo $a['country']; ?>)
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="space-y-1">
                                <label class="text-xs font-medium text-muted-foreground uppercase">Class Type</label>
                                <select name="type" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full appearance-none">
                                    <option value="ALL">All Types</option>
                                    <option value="ONE_ON_ONE" <?php echo $type === 'ONE_ON_ONE' ? 'selected' : ''; ?>>1-on-1 Session</option>
                                    <option value="GROUP" <?php echo $type === 'GROUP' ? 'selected' : ''; ?>>Group Class</option>
                                    <option value="CHAT" <?php echo $type === 'CHAT' ? 'selected' : ''; ?>>Chat Consultation</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">Apply Filters</button>

                        <?php if ($queryParam || $authority !== "ALL" || $type !== "ALL" || $category !== "ALL"): ?>
                            <a href="/classes" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">Clear Filters</a>
                        <?php endif; ?>
                    </form>
                </div>
            </div>
        </div>

        <!-- Results Grid -->
        <div class="lg:col-span-3">
            <?php if (empty($classes)): ?>
                <div class="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                    <h3 class="text-lg font-semibold">No classes found</h3>
                    <p class="text-muted-foreground mt-1">Try adjusting your filters or search terms.</p>
                    <a href="/classes" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-sky-500 underline-offset-4 hover:underline h-10 px-4 py-2 mt-4">
                        Clear all filters
                    </a>
                </div>
            <?php else: ?>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <?php foreach ($classes as $class): ?>
                        <?php 
                        $class['description'] = $class['short_description'];
                        // include partial is better for loop or manual render
                        ?>
                        <?php include APP_ROOT . '/views/partials/class_card.php'; ?>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
