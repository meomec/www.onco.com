<?php

/**
 * @file
 * Contains \Drupal\bg_image_formatter\Plugin\Field\FieldFormatter\BgImageFormatter.
 */

namespace Drupal\bg_image_formatter\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\image\Plugin\Field\FieldFormatter\ImageFormatter;
use Drupal\Core\Form\FormStateInterface;


/**
 * @FieldFormatter(
 *  id = "bg_image_formatter",
 *  label = @Translation("Background Image"),
 *  field_types = {"image"}
 * )
 */
class BgImageFormatter extends ImageFormatter {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return array(
      'image_style' => '',
      'css_settings' => array(
        'bg_image_selector' => 'body',
        'bg_image_color' => '#FFFFFF',
        'bg_image_x' => 'left',
        'bg_image_y' => 'top',
        'bg_image_attachment' => 'scroll',
        'bg_image_repeat' => 'no-repeat',
        'bg_image_background_size' => '',
        'bg_image_background_size_ie8' => 0,
        'bg_image_media_query' => 'all',
        'bg_image_important' => 1
      )
    );
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $element = array();
    $settings = $this->getSettings();

    // Options for repeating the image
    $repeat_options = array(
      'no-repeat' => t('No Repeat'),
      'repeat' => t('Tiled (repeat)'),
      'repeat-x' => t('Repeat Horizontally (repeat-x)'),
      'repeat-y' => t('Repeat Vertically (repeat-y)'),
    );

    $element['image_style'] = array(
      '#title' => t('Image style'),
      '#type' => 'select',
      '#default_value' => $settings['image_style'],
      '#empty_option' => t('None (original image)'),
      '#options' => image_style_options(),
      '#description' => t(
        'Select <a href="@href_image_style">the image style</a> to apply on' .
        'images.',
        array(
          '@href_image_style' => \Drupal\Core\Url::fromRoute('image.style_add')->toString(),
        )
      )
    );

    // Fieldset for css settings
    $element['css_settings'] = array(
      '#type' => 'fieldset',
      '#title' => t('Default CSS Settings'),
      '#description' => t('Default CSS settings for outputting the background property. These settings will be concatenated to form a complete css statement that uses the "background" property. For more information on the css background property see http://www.w3schools.com/css/css_background.asp"'),
    );
    // The selector for the background property
    $element['css_settings']['bg_image_selector'] = array(
      '#type' => 'textarea',
      '#title' => t('Selector(s)'),
      '#description' => t('A valid CSS selector that will be used to apply the background image. One per line. If the field is a multivalue field, the first line will be applied to the first value, the second to the second value... and so on.'),
      '#default_value' => $settings['css_settings']['bg_image_selector'],
    );
    // The selector for the background property
    $element['css_settings']['bg_image_color'] = array(
      '#type' => 'textfield',
      '#title' => t('Color'),
      '#description' => t('The background color formatted as any valid css color format (e.g. hex, rgb, text, hsl) [<a href="http://www.w3schools.com/css/pr_background-color.asp">css property: background-color</a>]'),
      '#default_value' => $settings['css_settings']['bg_image_color'],
    );

    // The selector for the background property
    $element['css_settings']['bg_image_x'] = array(
      '#type' => 'textfield',
      '#title' => t('Horizontal Alignment'),
      '#description' => t('The horizontal alignment of the background image formatted as any valid css alignment. [<a href="http://www.w3schools.com/css/pr_background-position.asp">css property: background-position</a>]'),
      '#default_value' => $settings['css_settings']['bg_image_x'],
    );
    // The selector for the background property
    $element['css_settings']['bg_image_y'] = array(
      '#type' => 'textfield',
      '#title' => t('Vertical Alignment'),
      '#description' => t('The vertical alignment of the background image formatted as any valid css alignment. [<a href="http://www.w3schools.com/css/pr_background-position.asp">css property: background-position</a>]'),
      '#default_value' => $settings['css_settings']['bg_image_y'],
    );
    // The selector for the background property
    $element['css_settings']['bg_image_attachment'] = array(
      '#type' => 'radios',
      '#title' => t('Background Attachment'),
      '#description' => t('The attachment setting for the background image. [<a href="http://www.w3schools.com/css/pr_background-attachment.asp">css property: background-attachment</a>]'),
      '#options' => array('scroll' => 'Scroll', 'fixed' => 'Fixed'),
      '#default_value' => $settings['css_settings']['bg_image_attachment'],
    );
    // The background-repeat property
    $element['css_settings']['bg_image_repeat'] = array(
      '#type' => 'radios',
      '#title' => t('Background Repeat'),
      '#description' => t('Define the repeat settings for the background image. [<a href="http://www.w3schools.com/css/pr_background-repeat.asp">css property: background-repeat</a>]'),
      '#options' => $repeat_options,
      '#default_value' => $settings['css_settings']['bg_image_repeat'],
    );
    // The background-size property
    $element['css_settings']['bg_image_background_size'] = array(
      '#type' => 'textfield',
      '#title' => t('Background Size'),
      '#description' => t('The size of the background (NOTE: CSS3 only. Useful for responsive designs) [<a href="http://www.w3schools.com/cssref/css3_pr_background-size.asp">css property: background-size</a>]'),
      '#default_value' => $settings['css_settings']['bg_image_background_size'],
    );
    // background-size:cover suppor for IE8
    $element['css_settings']['bg_image_background_size_ie8'] = array(
      '#type' => 'checkbox',
      '#title' => t('Add background-size:cover support for ie8'),
      '#description' => t('The background-size css property is only supported on browsers that support CSS3. However, there is a workaround for IE using Internet Explorer\'s built-in filters (http://msdn.microsoft.com/en-us/library/ms532969%28v=vs.85%29.aspx). Check this box to add the filters to the css. Sometimes it works well, sometimes it doesn\'t. Use at your own risk'),
      '#default_value' => $settings['css_settings']['bg_image_background_size_ie8'],
    );
    // The media query specifics
    $element['css_settings']['bg_image_media_query'] = array(
      '#type' => 'textfield',
      '#title' => t('Media Query'),
      '#description' => t('Apply this background image css using a media query. CSS3 Only. Useful for responsive designs. example: only screen and (min-width:481px) and (max-width:768px) [<a href="http://www.w3.org/TR/css3-mediaqueries/">Read about media queries</a>]'),
      '#default_value' => $settings['css_settings']['bg_image_media_query'],
    );
    $element['css_settings']['bg_image_important'] = array(
      '#type' => 'checkbox',
      '#title' => t('Add "!important" to the background property.'),
      '#description' => t('This can be helpful to override any existing background image or color properties added by the theme.'),
      '#default_value' => $settings['css_settings']['bg_image_important'],
    );

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = array();
    $settings = $this->getSettings();

    $image_styles = image_style_options(FALSE);
    unset($image_styles['']);
    if (isset($settings['css_settings']['bg_image_selector'])) {
      $summary[] = t('CSS Selector: @selector', array('@selector' => $settings['css_settings']['bg_image_selector']));
    }
    else {
      $summary[] = t('No selector');
    }

    if (isset($image_styles[$settings['image_style']])) {
      $summary[] = t('URL for image style: @style', array('@style' => $image_styles[$settings['image_style']]));
    }
    else {
      $summary[] = t('Original image style');
    }

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = array();

    $settings = $this->getSettings();
    $css_settings = $settings['css_settings'];
    $image_style = $settings['image_style'] ? $settings['image_style'] : NULL;
    $files = $this->getEntitiesToView($items, $langcode);

    // Early opt-out if the field is empty.
    if (empty($files)) {
      return $elements;
    }

    $media_query = isset($css_settings['bg_image_media_query']) ? $css_settings['bg_image_media_query'] : 'all';

    foreach ($files as $delta => $file) {
      if ($image_style) {
        $style = $this->imageStyleStorage->load($image_style);
        $image_url = $style->buildUrl($file->getFileUri());
      } else {
        $image_url = file_create_url($file->getFileUri());
      }

      $css = bg_image_add_background_image($image_url, $css_settings);

      $elements['#attached']['html_head'][] = [[
        '#tag' => 'style',
        '#attributes' => [
          'media' => $media_query
        ],
        '#value' => $css
      ], 'bg_image_formatter_css_' . $delta];
    }

    return $elements;
  }
}


