import type { ContentScript, Platform, Tone, ScriptSection } from '@/lib/types';

// ========================================
// SCRIPT GENERATION
// ========================================

/**
 * Generate content script based on topic and parameters
 */
export function generateContentScript(
  topic: string,
  platform: Platform,
  tone: Tone,
  duration: number,
  brandContext?: string
): ContentScript {
  // Generate hooks
  const hooks = generateHooks(topic, tone);

  // Generate body sections
  const body = generateBody(topic, duration, tone, platform);

  // Generate CTAs
  const cta = generateCTAs(topic, platform, tone);

  // Calculate word count
  const wordCount = calculateWordCount(hooks, body, cta);

  return {
    topic,
    platform,
    tone,
    duration,
    hook: hooks,
    body,
    cta,
    wordCount,
  };
}

/**
 * Generate hook variations
 */
function generateHooks(topic: string, tone: Tone): string[] {
  const hooks: string[] = [];

  // Pattern interrupt hook
  hooks.push(generatePatternInterruptHook(topic, tone));

  // Question hook
  hooks.push(generateQuestionHook(topic, tone));

  // Bold statement hook
  hooks.push(generateBoldStatementHook(topic, tone));

  return hooks;
}

/**
 * Generate pattern interrupt hook
 */
function generatePatternInterruptHook(topic: string, tone: Tone): string {
  const templates = {
    casual: [
      `Stop scrolling if you're into ${topic}!`,
      `Wait... you need to see this about ${topic}`,
      `POV: You just discovered ${topic}`,
    ],
    professional: [
      `Here's what you need to know about ${topic}`,
      `The truth about ${topic} that nobody talks about`,
      `3 things about ${topic} that changed everything`,
    ],
    educational: [
      `Let me explain ${topic} in 60 seconds`,
      `The science behind ${topic} explained`,
      `Everything you need to know about ${topic}`,
    ],
    energetic: [
      `THIS is why ${topic} is INSANE!`,
      `You WON'T BELIEVE what happened with ${topic}!`,
      `STOP! This ${topic} hack is CRAZY!`,
    ],
    inspirational: [
      `How ${topic} changed my life`,
      `The ${topic} journey nobody talks about`,
      `Why ${topic} matters more than you think`,
    ],
  };

  const options = templates[tone] || templates.casual;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Generate question hook
 */
function generateQuestionHook(topic: string, tone: Tone): string {
  const templates = {
    casual: [
      `Ever wondered about ${topic}?`,
      `What if I told you ${topic} could change everything?`,
      `Ready to learn about ${topic}?`,
    ],
    professional: [
      `What does ${topic} mean for your business?`,
      `How can ${topic} improve your workflow?`,
      `Is ${topic} worth the investment?`,
    ],
    educational: [
      `What is ${topic} and why does it matter?`,
      `How does ${topic} actually work?`,
      `What are the benefits of ${topic}?`,
    ],
    energetic: [
      `Want to MASTER ${topic}?!`,
      `Ready to LEVEL UP with ${topic}?!`,
      `Can ${topic} really do THAT?!`,
    ],
    inspirational: [
      `What if ${topic} is the answer you've been looking for?`,
      `Could ${topic} be your breakthrough?`,
      `What would ${topic} mean for your future?`,
    ],
  };

  const options = templates[tone] || templates.casual;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Generate bold statement hook
 */
function generateBoldStatementHook(topic: string, tone: Tone): string {
  const templates = {
    casual: [
      `${topic} is about to blow your mind`,
      `Nobody talks about ${topic} like this`,
      `This ${topic} secret is game-changing`,
    ],
    professional: [
      `${topic} is revolutionizing the industry`,
      `The future of ${topic} starts now`,
      `${topic} delivers measurable results`,
    ],
    educational: [
      `${topic} explained in the simplest way`,
      `The complete guide to ${topic}`,
      `Understanding ${topic} made easy`,
    ],
    energetic: [
      `${topic} is ABSOLUTELY INSANE!`,
      `This ${topic} trick is MIND-BLOWING!`,
      `${topic} just got 10X BETTER!`,
    ],
    inspirational: [
      `${topic} transformed everything`,
      `The power of ${topic} is undeniable`,
      `${topic} is your path forward`,
    ],
  };

  const options = templates[tone] || templates.casual;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Generate body sections with timestamps
 */
function generateBody(
  topic: string,
  duration: number,
  tone: Tone,
  platform: Platform
): ScriptSection[] {
  const sections: ScriptSection[] = [];

  // Hook section (first 3 seconds)
  sections.push({
    timestamp: '0:00-0:03',
    content: 'Open with your chosen hook to grab attention immediately.',
    brollSuggestion: 'Close-up shot, eye contact with camera',
    textOverlay: 'Hook text overlay',
  });

  // Calculate remaining time for body
  const bodyDuration = duration - 6; // 3s hook + 3s CTA
  const bodyStart = 3;
  const bodyEnd = bodyStart + bodyDuration;

  // Main content (middle section)
  if (bodyDuration >= 10) {
    // Long form - multiple points
    const pointDuration = Math.floor(bodyDuration / 3);

    sections.push({
      timestamp: `0:${String(bodyStart).padStart(2, '0')}-0:${String(bodyStart + pointDuration).padStart(2, '0')}`,
      content: `Point 1: Introduce the main concept of ${topic}. Explain what it is and why it matters.`,
      brollSuggestion: 'Medium shot, gestures to emphasize points',
      textOverlay: 'Key point #1',
    });

    sections.push({
      timestamp: `0:${String(bodyStart + pointDuration).padStart(2, '0')}-0:${String(bodyStart + pointDuration * 2).padStart(2, '0')}`,
      content: `Point 2: Share a specific example or benefit of ${topic}. Make it relatable.`,
      brollSuggestion: 'B-roll footage showing example',
      textOverlay: 'Key point #2',
    });

    sections.push({
      timestamp: `0:${String(bodyStart + pointDuration * 2).padStart(2, '0')}-0:${String(bodyEnd).padStart(2, '0')}`,
      content: `Point 3: Provide actionable takeaway or next step related to ${topic}.`,
      brollSuggestion: 'Wide shot, confident pose',
      textOverlay: 'Key point #3',
    });
  } else {
    // Short form - single focused message
    sections.push({
      timestamp: `0:${String(bodyStart).padStart(2, '0')}-0:${String(bodyEnd).padStart(2, '0')}`,
      content: `Deliver your main message about ${topic}. Keep it focused and impactful. One clear takeaway.`,
      brollSuggestion: 'Dynamic shots, quick cuts',
      textOverlay: 'Main message',
    });
  }

  // CTA section (last 3-5 seconds)
  sections.push({
    timestamp: `0:${String(bodyEnd).padStart(2, '0')}-0:${String(duration).padStart(2, '0')}`,
    content: 'End with your chosen call-to-action.',
    brollSuggestion: 'Direct to camera, clear CTA',
    textOverlay: 'CTA text',
  });

  return sections;
}

/**
 * Generate CTA variations
 */
function generateCTAs(topic: string, platform: Platform, tone: Tone): string[] {
  const ctas: string[] = [];

  // Soft CTA
  if (platform === 'tiktok' || platform === 'instagram') {
    ctas.push('Follow for more tips like this!');
    ctas.push('Save this for later and share with a friend!');
  } else if (platform === 'youtube-shorts') {
    ctas.push('Subscribe for more content about ' + topic);
    ctas.push('Like if this helped you!');
  } else {
    ctas.push('Follow for more insights on ' + topic);
  }

  // Hard CTA
  ctas.push('Link in bio to learn more about ' + topic);
  ctas.push('Check out the full guide in my bio!');

  return ctas;
}

/**
 * Calculate total word count
 */
function calculateWordCount(
  hooks: string[],
  body: ScriptSection[],
  ctas: string[]
): number {
  let count = 0;

  // Count hook words (use first hook)
  count += hooks[0].split(' ').length;

  // Count body words
  body.forEach((section) => {
    count += section.content.split(' ').length;
  });

  // Count CTA words (use first CTA)
  count += ctas[0].split(' ').length;

  return count;
}

// ========================================
// PLATFORM-SPECIFIC OPTIMIZATION
// ========================================

/**
 * Optimize script for specific platform
 */
export function optimizeForPlatform(
  script: ContentScript,
  platform: Platform
): ContentScript {
  const optimized = { ...script };

  switch (platform) {
    case 'tiktok':
      // TikTok: Fast-paced, trending sounds, hashtags
      optimized.body = optimized.body.map((section) => ({
        ...section,
        content: section.content + ' Keep it snappy and energetic.',
      }));
      break;

    case 'instagram':
      // Instagram: Visual focus, aesthetic, stories
      optimized.body = optimized.body.map((section) => ({
        ...section,
        brollSuggestion: section.brollSuggestion + ' High-quality visuals.',
      }));
      break;

    case 'youtube-shorts':
      // YouTube: Longer retention, subscribe focus
      optimized.cta = [
        'Don\'t forget to subscribe!',
        'Hit that subscribe button for more!',
      ];
      break;

    case 'twitter':
      // Twitter: Text-heavy, concise, thread-worthy
      optimized.body = optimized.body.map((section) => ({
        ...section,
        content: section.content.substring(0, 100) + '...',
      }));
      break;
  }

  return optimized;
}
