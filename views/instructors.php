<?php
/**
 * AviatorTutor Instructors Browse Page
 */

use App\Lib\Database;

$title = "Find Your Instructor - AviatorTutor";
$description = "Connect with certified pilots and aviation experts customized to your learning needs.";

// Parse search params
$queryParam = $_GET['q'] ?? null;
$minRating = isset($_GET['minRating']) ? (float)$_GET['minRating'] : 0;
$maxPrice = isset($_GET['maxPrice']) ? (float)$_GET['maxPrice'] : 0;
$sort = $_GET['sort'] ?? "rating";

try {
    $db = Database::getInstance();
    
    // Construct MySQL Query
    $sql = "SELECT ip.*, u.name, u.image
            FROM instructor_profiles ip
            JOIN users u ON ip.user_id = u.id
            WHERE ip.pending_approval = FALSE ";
    
    $params = [];
    
    if ($queryParam) {
        $sql .= " AND (u.name LIKE :q OR ip.bio LIKE :q OR JSON_CONTAINS(ip.authorities, JSON_QUOTE(:q_raw))) ";
        $params['q'] = '%' . $queryParam . '%';
        $params['q_raw'] = $queryParam;
    }
    
    if ($minRating > 0) {
        $sql .= " AND ip.rating >= :minRating ";
        $params['minRating'] = $minRating;
    }
    
    if ($maxPrice > 0) {
        $sql .= " AND ip.hourly_rate_default <= :maxPrice ";
        $params['maxPrice'] = $maxPrice;
    }
    
    // Determining Sort Order
    switch ($sort) {
        case 'price_asc':
            $sql .= " ORDER BY ip.hourly_rate_default ASC ";
            break;
        case 'price_desc':
            $sql .= " ORDER BY ip.hourly_rate_default DESC ";
            break;
        case 'reviews':
            $sql .= " ORDER BY ip.total_reviews DESC ";
            break;
        case 'rating':
        default:
            $sql .= " ORDER BY ip.rating DESC ";
            break;
    }
    
    $db->query($sql);
    foreach ($params as $key => $val) {
        $db->bind($key, $val);
    }
    
    $instructors = $db->resultSet();
    $totalCount = count($instructors);
    
} catch (\Exception $e) {
    error_log($e->getMessage());
    $instructors = [];
    $totalCount = 0;
}

ob_start();
?>

<div class="container mx-auto px-4 py-8 min-h-screen">
    <!-- Header -->
    <div class="mb-10 space-y-6">
        <div>
            <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3">Find Your Instructor</h1>
            <p class="text-muted-foreground text-lg max-w-2xl">
                Connect with certified pilots and aviation experts customized to your learning needs.
            </p>
        </div>

        <!-- Search Bar -->
        <div class="flex flex-col sm:flex-row gap-4">
            <div class="relative flex-1 max-w-2xl">
                <i data-lucide="search" class="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground"></i>
                <form action="/instructors" method="GET" class="w-full">
                    <input
                        name="q"
                        placeholder="Search by name, aircraft, or bio..."
                        class="flex h-12 w-full rounded-md border border-input bg-background px-11 py-2 text-lg shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value="<?php echo htmlspecialchars($queryParam); ?>"
                    />
                </form>
            </div>
        </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="w-full lg:w-64 shrink-0 space-y-8">
            <div class="lg:sticky lg:top-24 rounded-lg border bg-card/50 p-6 backdrop-blur-sm shadow-sm">
                <form action="/instructors" method="GET" class="space-y-6">
                    <?php if ($queryParam): ?>
                        <input type="hidden" name="q" value="<?php echo htmlspecialchars($queryParam); ?>">
                    <?php endif; ?>
                    
                    <div class="space-y-4">
                        <h3 class="font-bold text-sm uppercase tracking-wider">Rating</h3>
                        <select name="minRating" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary w-full">
                            <option value="0">Any Rating</option>
                            <option value="4.5" <?php echo $minRating == 4.5 ? 'selected' : ''; ?>>4.5+ Stars</option>
                            <option value="4.0" <?php echo $minRating == 4.0 ? 'selected' : ''; ?>>4.0+ Stars</option>
                            <option value="3.5" <?php echo $minRating == 3.5 ? 'selected' : ''; ?>>3.5+ Stars</option>
                        </select>
                    </div>

                    <div class="space-y-4">
                        <h3 class="font-bold text-sm uppercase tracking-wider">Price (Max)</h3>
                        <div class="flex gap-2 items-center">
                            <span class="text-xs text-muted-foreground">$</span>
                            <input type="number" name="maxPrice" placeholder="Any" value="<?php echo $maxPrice > 0 ? $maxPrice : ''; ?>" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h3 class="font-bold text-sm uppercase tracking-wider">Sort by</h3>
                        <select name="sort" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary w-full">
                            <option value="rating" <?php echo $sort == 'rating' ? 'selected' : ''; ?>>Highest Rated</option>
                            <option value="price_asc" <?php echo $sort == 'price_asc' ? 'selected' : ''; ?>>Price: Low to High</option>
                            <option value="price_desc" <?php echo $sort == 'price_desc' ? 'selected' : ''; ?>>Price: High to Low</option>
                            <option value="reviews" <?php echo $sort == 'reviews' ? 'selected' : ''; ?>>Most Reviews</option>
                        </select>
                    </div>

                    <button type="submit" class="w-full bg-primary text-primary-foreground h-10 rounded-md font-semibold hover:bg-primary/90 transition-colors">Apply Filters</button>
                    
                    <?php if ($queryParam || $minRating > 0 || $maxPrice > 0): ?>
                        <a href="/instructors" class="block text-center text-sm text-primary hover:underline">Clear all filters</a>
                    <?php endif; ?>
                </form>
            </div>
        </aside>

        <!-- Results Grid -->
        <div class="flex-1">
            <div class="mb-6 flex items-center justify-between gap-4">
                <h2 class="text-sm font-semibold text-muted-foreground">
                    Showing <?php echo $totalCount; ?> <?php echo $totalCount === 1 ? 'instructor' : 'instructors'; ?>
                </h2>
            </div>

            <?php if ($totalCount === 0): ?>
                <div class="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl bg-muted/10">
                    <div class="rounded-full bg-muted/50 p-6 mb-4">
                        <i data-lucide="search" class="h-10 w-10 text-muted-foreground"></i>
                    </div>
                    <h3 class="text-xl font-bold">No instructors found</h3>
                    <p class="text-muted-foreground mt-2 max-w-sm">
                        We couldn't find any instructors matching your current filters. Try adjusting your search criteria.
                    </p>
                    <a href="/instructors" class="mt-6 text-primary font-bold hover:underline">
                        Clear all filters
                    </a>
                </div>
            <?php else: ?>
                <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <?php foreach ($instructors as $instructor): ?>
                        <?php 
                        $instructor['experience'] = $instructor['years_of_experience'];
                        ?>
                        <?php include APP_ROOT . '/views/partials/instructor_card.php'; ?>
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
