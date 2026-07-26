'use client';

interface PersonalityPreviewProps {
  personality: {
    tone: string;
    style: string;
    keywords: string[];
    positioning?: string;
    tagline?: string;
  };
}

export function PersonalityPreview({ personality }: PersonalityPreviewProps) {
  return (
    <div className="border border-[#3a322a] bg-[#241f1a] rounded p-6 space-y-4">
      <h3 className="text-sm font-bold tracking-wider" style={{ fontFamily: "'Space Grotesk', monospace", color: '#d9453b' }}>
        BRAND PERSONALITY
      </h3>

      {personality.tagline && (
        <div className="border-l-2 border-[#d9453b] pl-4">
          <p className="text-xs text-[#6b5f52] font-bold tracking-wider mb-1">TAGLINE</p>
          <p className="text-lg font-bold" style={{ fontFamily: "'Instrument Serif', serif", color: '#f0e8dc' }}>
            &ldquo;{personality.tagline}&rdquo;
          </p>
        </div>
      )}

      {personality.positioning && (
        <div>
          <p className="text-xs text-[#6b5f52] font-bold tracking-wider mb-1">POSITIONING</p>
          <p className="text-sm text-[#a09484]">{personality.positioning}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[#6b5f52] font-bold tracking-wider mb-1">TONE</p>
          <p className="text-sm text-[#f0e8dc] font-bold">{personality.tone}</p>
        </div>
        <div>
          <p className="text-xs text-[#6b5f52] font-bold tracking-wider mb-1">STYLE</p>
          <p className="text-sm text-[#f0e8dc] font-bold">{personality.style}</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-[#6b5f52] font-bold tracking-wider mb-2">KEYWORDS</p>
        <div className="flex flex-wrap gap-2">
          {personality.keywords.map((keyword, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs font-bold rounded"
              style={{ background: '#1c1915', border: '1px solid #3a322a', color: '#a09484' }}
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
