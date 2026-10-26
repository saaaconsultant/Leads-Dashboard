export default function DMMediaGallery({ dmId, media = [] }) {
  if (!media.length) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-bold text-slate-800">Attachments ({media.length})</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {media.map((item) => {
          const src = `/api/dm/${dmId}/media/${item.id}`;
          return (
            <figure key={item.id} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {item.mimeType.startsWith("video/") ? (
                <video src={src} controls preload="metadata" className="aspect-video w-full object-contain" aria-label={item.fileName} />
              ) : (
                <a href={src} target="_blank" rel="noreferrer" aria-label={`Open ${item.fileName}`}>
                  <img src={src} alt={item.fileName} className="aspect-video w-full object-cover" />
                </a>
              )}
              <figcaption className="truncate px-2.5 py-2 text-[11px] text-slate-600">{item.fileName}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
