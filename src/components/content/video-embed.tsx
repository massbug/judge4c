interface VideoEmbedProps {
  platform: "youtube" | "bilibili";
  id: string;
}

const platformSrcMap = {
  youtube: (id: string) => `https://www.youtube.com/embed/${id}`,
  bilibili: (id: string) =>
    `https://player.bilibili.com/player.html?bvid=${id}&autoplay=0`,
} as const;

export function VideoEmbed({ platform, id }: VideoEmbedProps) {
  return (
    <iframe
      className="aspect-video w-full"
      src={platformSrcMap[platform](id)}
      title={`${platform} Video Player`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    />
  );
}
