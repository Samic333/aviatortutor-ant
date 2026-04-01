<?php
/**
 * Class Card Partial
 * 
 * Expected $class array with:
 * - id
 * - title
 * - instructor_name
 * - authority
 * - price_per_hour
 * - fixed_price
 * - type
 * - booking_count
 * - description
 */
?>
<a href="/classes/<?php echo $class['id']; ?>" class="group flex flex-col rounded-2xl border bg-card hover:shadow-xl hover:border-primary/50 transition-all duration-300 p-0 overflow-hidden">
    <div class="h-2 bg-primary w-full"></div>
    <div class="p-6 flex-1 flex flex-col">
        <div class="flex justify-between items-start mb-4">
            <div class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                <?php echo str_replace('_', ' ', $class['type']); ?>
            </div>
            <?php if ($class['authority']): ?>
            <div class="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                <?php echo $class['authority']; ?>
            </div>
            <?php endif; ?>
        </div>
        
        <h3 class="font-bold text-xl mb-2 group-hover:text-primary transition-colors leading-tight line-clamp-2">
            <?php echo $class['title']; ?>
        </h3>
        
        <p class="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            <?php echo $class['description'] ?? 'No description available.'; ?>
        </p>
        
        <div class="mt-auto flex items-center justify-between pt-4 border-t border-dashed">
            <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    <i data-lucide="user" class="h-4 w-4 text-muted-foreground"></i>
                </div>
                <div>
                    <div class="text-xs font-bold text-foreground"><?php echo $class['instructor_name']; ?></div>
                    <div class="text-[10px] text-muted-foreground"><?php echo $class['booking_count']; ?> bookings</div>
                </div>
            </div>
            <div class="text-lg font-bold text-foreground">
                <?php 
                if ($class['fixed_price']) {
                    echo '$' . number_format($class['fixed_price'], 0);
                } else {
                    echo '$' . number_format($class['price_per_hour'], 0) . '/hr';
                }
                ?>
            </div>
        </div>
    </div>
</a>
