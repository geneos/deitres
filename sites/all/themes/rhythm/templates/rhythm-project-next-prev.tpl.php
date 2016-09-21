<?php
       global $language;
       $lang = $language->language;
       $base_node = node_load($all_works);
       $translations = translation_node_get_translations($base_node->tnid);       
       $translated_node = (isset($translations[$lang])) ? node_load($translations[$lang]->nid) : $base_node;
?>
<hr class="mt-0 mb-0 ">
<div class="work-navigation clearfix">
  <a href="<?php print url('node/' . $prev); ?>" class="work-prev"><span><i class="fa fa-chevron-left"></i>&nbsp;<?php print t('Previous'); ?></span></a>
  <a href="<?php print url('node/'.$translated_node->nid);?>" class="work-all"><span><i class="fa fa-times"></i>&nbsp;<?php print t('All projects'); ?></span></a>
  <a href="<?php print url('node/' . $next); ?>" class="work-next"><span><?php print t('Next'); ?>&nbsp;<i class="fa fa-chevron-right"></i></span></a>
</div>