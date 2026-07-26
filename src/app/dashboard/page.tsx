'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProjectStore, calculateProjectCompletion, exportProjectData } from '@/lib/store/project-store';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function DashboardPage() {
  const router = useRouter();
  const {
    projectName,
    projectId,
    brand,
    sprites,
    scripts,
    selectedMoods,
    setProjectName,
    clearProject,
  } = useProjectStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(projectName);
  const [isExporting, setIsExporting] = useState(false);

  const completion = calculateProjectCompletion(useProjectStore.getState());

  useEffect(() => {
    setEditedName(projectName);
  }, [projectName]);

  const handleSaveName = () => {
    setProjectName(editedName);
    setIsEditing(false);
  };

  const handleExportJSON = () => {
    const data = exportProjectData(useProjectStore.getState());
    const blob = new Blob([data], { type: 'application/json' });
    saveAs(blob, `${projectName.replace(/\s+/g, '-')}.json`);
  };

  const handleExportZIP = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Add project metadata
      zip.file('project.json', exportProjectData(useProjectStore.getState()));

      // Add brand assets
      if (brand) {
        const brandFolder = zip.folder('brand');
        if (brandFolder) {
          brandFolder.file('colors.json', JSON.stringify(brand.colors, null, 2));
          brandFolder.file('typography.json', JSON.stringify(brand.typography, null, 2));
          
          // Add logos
          if (brand.logo) {
            const logosFolder = brandFolder.folder('logos');
            if (logosFolder) {
              Object.entries(brand.logo).forEach(([key, svgContent]) => {
                if (typeof svgContent === 'string' && svgContent) {
                  logosFolder.file(`${key}.svg`, svgContent);
                }
              });
            }
          }
        }
      }

      // Add sprites
      if (sprites.length > 0) {
        const spritesFolder = zip.folder('sprites');
        if (spritesFolder) {
          sprites.forEach((sprite, index) => {
            // Convert data URL to blob
            const base64Data = sprite.imageData.split(',')[1];
            spritesFolder.file(`sprite-${index + 1}.png`, base64Data, { base64: true });
            spritesFolder.file(`sprite-${index + 1}.json`, JSON.stringify({
              description: sprite.description,
              style: sprite.style,
              size: sprite.size,
              palette: sprite.palette,
            }, null, 2));
          });
        }
      }

      // Add scripts
      if (scripts.length > 0) {
        const scriptsFolder = zip.folder('scripts');
        if (scriptsFolder) {
          scripts.forEach((script, index) => {
            const scriptText = `
CONTENT SCRIPT ${index + 1}
====================

Topic: ${script.topic}
Platform: ${script.platform}
Tone: ${script.tone}
Duration: ${script.duration}s

HOOKS:
${script.hook.map((h, i) => `${i + 1}. ${h}`).join('\n')}

BODY:
${script.body.map((s) => `${s.timestamp}: ${s.content}`).join('\n\n')}

CTAs:
${script.cta.map((c, i) => `${i + 1}. ${c}`).join('\n')}
            `.trim();
            
            scriptsFolder.file(`script-${index + 1}.txt`, scriptText);
          });
        }
      }

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${projectName.replace(/\s+/g, '-')}.zip`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export project');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNewProject = () => {
    if (confirm('Start a new project? Current progress will be saved in browser storage.')) {
      clearProject();
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1915]" style={{ fontFamily: "'DM Sans', 'Space Grotesk', system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-2xl font-bold"
                  autoFocus
                />
                <Button onClick={handleSaveName} size="sm">
                  SAVE
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  CANCEL
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-wider">{projectName}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[#6b5f52] hover:text-[#f0e8dc] transition-colors"
                  aria-label="Edit project name"
                >
                  [EDIT]
                </button>
              </div>
            )}
            <Button onClick={handleNewProject} variant="outline">
              [ NEW PROJECT ]
            </Button>
          </div>
          <p className="text-[#6b5f52] text-sm">
            Project ID: {projectId} • {completion}% Complete
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-[#3a322a] rounded overflow-hidden">
            <div
              className="h-full bg-[#d9453b] transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Brand Module */}
          <Card>
            <CardHeader>
              <CardTitle>BRAND IDENTITY</CardTitle>
              <CardDescription>
                {brand ? 'Complete' : 'Not started'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {brand ? (
                <>
                  <div>
                    <p className="text-xs text-[#6b5f52] mb-2">COLORS</p>
                    <div className="flex gap-1">
                      {Object.values(brand.colors.primary).slice(0, 5).map((color, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 border border-[#3a322a] rounded"
                          style={{ backgroundColor: color as string }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#6b5f52] mb-1">TYPOGRAPHY</p>
                    <p className="text-sm text-[#f0e8dc]">{brand.typography.heading.name}</p>
                  </div>
                  <Button
                    onClick={() => router.push('/create/brand')}
                    variant="outline"
                    className="w-full"
                  >
                    [ VIEW BRAND ]
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => router.push('/create/brand')}
                  className="w-full"
                >
                  [ CREATE BRAND ]
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Pixel Module */}
          <Card>
            <CardHeader>
              <CardTitle>PIXEL ART</CardTitle>
              <CardDescription>
                {sprites.length} sprite{sprites.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sprites.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {sprites.slice(0, 3).map((sprite, i) => (
                      <div key={i} className="border border-[#3a322a] rounded p-2 bg-[#1c1915]">
                        <img
                          src={sprite.imageData}
                          alt={`Sprite ${i + 1}`}
                          className="w-full h-auto image-rendering-pixelated"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => router.push('/create/pixel')}
                    variant="outline"
                    className="w-full"
                  >
                    [ VIEW SPRITES ]
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => router.push('/create/pixel')}
                  className="w-full"
                >
                  [ CREATE SPRITES ]
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Content Module */}
          <Card>
            <CardHeader>
              <CardTitle>CONTENT SCRIPTS</CardTitle>
              <CardDescription>
                {scripts.length} script{scripts.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scripts.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {scripts.slice(0, 2).map((script, i) => (
                      <div key={i} className="border border-[#3a322a] rounded p-3">
                        <p className="text-xs text-[#6b5f52]">{script.platform}</p>
                        <p className="text-sm text-[#f0e8dc] truncate">{script.topic}</p>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => router.push('/create/content')}
                    variant="outline"
                    className="w-full"
                  >
                    [ VIEW SCRIPTS ]
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => router.push('/create/content')}
                  className="w-full"
                >
                  [ CREATE SCRIPTS ]
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle>EXPORT PROJECT</CardTitle>
            <CardDescription>
              Download all your creative assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleExportJSON}
                variant="outline"
                disabled={completion === 0}
              >
                [ EXPORT JSON ]
              </Button>
              <Button
                onClick={handleExportZIP}
                disabled={completion === 0 || isExporting}
              >
                {isExporting ? '[ EXPORTING... ]' : '[ EXPORT ZIP ]'}
              </Button>
            </div>
            <p className="text-xs text-[#6b5f52] mt-4">
              ZIP includes: Brand assets (colors, fonts, logos), Sprite PNGs, Content scripts
            </p>
          </CardContent>
        </Card>

        {/* Mood Sync Info */}
        {selectedMoods.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>MOOD SYNC</CardTitle>
              <CardDescription>
                Active mood keywords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedMoods.map((mood) => (
                  <span
                    key={mood}
                    className="px-3 py-1 bg-[#d9453b] text-white text-xs font-bold tracking-wider"
                  >
                    {mood.toUpperCase()}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}