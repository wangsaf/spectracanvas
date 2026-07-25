'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ContentScript } from '@/lib/types';
import { useState } from 'react';

interface ScriptPreviewProps {
  script: ContentScript;
  onDownload?: () => void;
}

export function ScriptPreview({ script, onDownload }: ScriptPreviewProps) {
  const [selectedHook, setSelectedHook] = useState(0);
  const [selectedCTA, setSelectedCTA] = useState(0);

  const handleCopyScript = () => {
    const fullScript = `
HOOK:
${script.hook[selectedHook]}

BODY:
${script.body.map((section) => `${section.timestamp}: ${section.content}`).join('\n\n')}

CTA:
${script.cta[selectedCTA]}
    `.trim();

    navigator.clipboard.writeText(fullScript);
  };

  const handleDownloadScript = () => {
    const fullScript = `
CONTENT SCRIPT
==============

Topic: ${script.topic}
Platform: ${script.platform}
Tone: ${script.tone}
Duration: ${script.duration}s
Word Count: ${script.wordCount}

HOOK OPTIONS:
${script.hook.map((h, i) => `${i + 1}. ${h}`).join('\n')}

BODY SECTIONS:
${script.body.map((section) => `
${section.timestamp}
Content: ${section.content}
B-Roll: ${section.brollSuggestion}
Text Overlay: ${section.textOverlay}
`).join('\n')}

CTA OPTIONS:
${script.cta.map((c, i) => `${i + 1}. ${c}`).join('\n')}
    `.trim();

    const blob = new Blob([fullScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `script-${script.topic.substring(0, 20).replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Script Info */}
      <Card>
        <CardHeader>
          <CardTitle>SCRIPT OVERVIEW</CardTitle>
          <CardDescription>
            {script.platform} • {script.tone} • {script.duration}s • {script.wordCount} words
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-500">Platform:</span>
              <p className="text-white font-bold mt-1">{script.platform.toUpperCase()}</p>
            </div>
            <div>
              <span className="text-neutral-500">Duration:</span>
              <p className="text-white font-bold mt-1">{script.duration} seconds</p>
            </div>
            <div>
              <span className="text-neutral-500">Tone:</span>
              <p className="text-white font-bold mt-1">{script.tone.toUpperCase()}</p>
            </div>
            <div>
              <span className="text-neutral-500">Word Count:</span>
              <p className="text-white font-bold mt-1">{script.wordCount} words</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hook Selection */}
      <Card>
        <CardHeader>
          <CardTitle>HOOK OPTIONS</CardTitle>
          <CardDescription>
            Choose your opening line (first 3 seconds)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {script.hook.map((hook, index) => (
            <button
              key={index}
              onClick={() => setSelectedHook(index)}
              className={`w-full p-4 text-left border transition-colors ${
                selectedHook === index
                  ? 'bg-[#00ff88] text-black border-[#00ff88]'
                  : 'bg-transparent text-neutral-400 border-[#222] hover:border-[#00ff88] hover:text-white'
              }`}
            >
              <div className="text-xs font-bold tracking-wider mb-2">OPTION {index + 1}</div>
              <div className="text-sm">{hook}</div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Body Sections */}
      <Card>
        <CardHeader>
          <CardTitle>BODY SECTIONS</CardTitle>
          <CardDescription>
            Main content with timestamps and B-roll suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {script.body.map((section, index) => (
            <div key={index} className="border border-[#222] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-[#00ff88]">
                  {section.timestamp}
                </span>
                <span className="text-xs text-neutral-500">SECTION {index + 1}</span>
              </div>
              
              <div>
                <p className="text-xs font-bold tracking-wider text-neutral-400 mb-1">
                  CONTENT:
                </p>
                <p className="text-sm text-white">{section.content}</p>
              </div>

              <div>
                <p className="text-xs font-bold tracking-wider text-neutral-400 mb-1">
                  B-ROLL:
                </p>
                <p className="text-xs text-neutral-500">{section.brollSuggestion}</p>
              </div>

              <div>
                <p className="text-xs font-bold tracking-wider text-neutral-400 mb-1">
                  TEXT OVERLAY:
                </p>
                <p className="text-xs text-neutral-500">{section.textOverlay}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CTA Selection */}
      <Card>
        <CardHeader>
          <CardTitle>CALL-TO-ACTION</CardTitle>
          <CardDescription>
            Choose your closing statement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {script.cta.map((cta, index) => (
            <button
              key={index}
              onClick={() => setSelectedCTA(index)}
              className={`w-full p-4 text-left border transition-colors ${
                selectedCTA === index
                  ? 'bg-[#00ff88] text-black border-[#00ff88]'
                  : 'bg-transparent text-neutral-400 border-[#222] hover:border-[#00ff88] hover:text-white'
              }`}
            >
              <div className="text-xs font-bold tracking-wider mb-2">OPTION {index + 1}</div>
              <div className="text-sm">{cta}</div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={handleCopyScript}>
          [ COPY SCRIPT ]
        </Button>
        <Button onClick={handleDownloadScript}>
          [ DOWNLOAD TXT ]
        </Button>
      </div>
    </div>
  );
}
