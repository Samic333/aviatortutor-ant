<?php
/**
 * Instructor Card Partial
 * 
 * Expected $instructor array with:
 * - id
 * - name
 * - bio
 * - rating
 * - total_reviews
 * - hourly_rate_default
 * - experience (years)
 * - image
 */
?>
<a href="/instructors/<?php echo $instructor['id']; ?>" class="group relative flex flex-col overflow-hidden rounded-2xl border bg-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
    <div class="aspect-[4/3] bg-muted relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 z-10"></div>
        <div class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-muted-foreground group-hover:scale-105 transition-transform duration-500">
            <?php if (!empty($instructor['image'])): ?>
                <img src="<?php echo $instructor['image']; ?>" alt="<?php echo $instructor['name']; ?>" class="h-full w-full object-cover">
            <?php else: ?>
                <div class="text-center">
                    <div class="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-3"></div>
                    <span><?php echo $instructor['name']; ?></span>
                </div>
            <?php endif; ?>
        </div>
        <div class="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
            <div class="px-2 py-1 bg-white/90 dark:bg-black/80 backdrop-blur rounded text-xs font-bold shadow-sm">
                <?php echo $instructor['experience']; ?>+ Years Exp.
            </div>
        </div>
    </div>
    <div class="p-6 flex-1 flex flex-col">
        <h3 class="font-bold text-xl mb-1 group-hover:text-primary transition-colors"><?php echo $instructor['name']; ?></h3>
        <p class="text-xs text-muted-foreground mb-4 line-clamp-2"><?php echo $instructor['bio']; ?></p>

        <div class="mt-auto flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-amber-500 font-bold">
                <span>★</span> <?php echo number_format($instructor['rating'], 1); ?> 
                <span class="text-muted-foreground font-normal text-xs">(<?php echo $instructor['total_reviews']; ?>)</span>
            </div>
            <div class="text-sm font-semibold text-primary">
                $<?php echo number_format($instructor['hourly_rate_default'], 0); ?>/hr
            </div>
        </div>
    </div>
</a>
