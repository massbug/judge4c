interface VideoEmbedProps {
  platform: "youtube" | "bilibili";
  id: string;
}

const platformSrcMap: Record<VideoEmbedProps["platform"], string> = {
  youtube: "https://www.youtube.com/embed/",
  bilibili: "https://player.bilibili.com/player.html?bvid=",
};

export function VideoEmbed({
  platform,
  id,
}: VideoEmbedProps) {
  const src = platformSrcMap[platform] + id;

  return (
    <div>
      <iframe
        className="aspect-video w-full"
        src={src}
        title={`${platform} Video Player`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      />
    </div>
  );
}
