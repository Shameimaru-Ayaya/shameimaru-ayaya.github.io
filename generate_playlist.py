import os
import json
import unicodedata


def scan_bgm_root():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    bgm_root = os.path.join(base_dir, "static", "bgm")
    result = []
    if not os.path.isdir(bgm_root):
        return result

    def normalize_path_component(value: str) -> str:
        return unicodedata.normalize("NFC", value)

    def parse_track_metadata(value: str, artist_separator: str) -> tuple[str, str, bool]:
        normalized_value = normalize_path_component(value).strip()
        if " - " not in normalized_value:
            return normalized_value, "", False
        name_part, artist_part = normalized_value.split(" - ", 1)
        name = name_part.strip()
        artists = [item.strip() for item in artist_part.split(artist_separator) if item.strip()]
        if not name or not artists:
            return normalized_value, "", False
        return name, artist_separator.join(artists), True

    audio_exts = {".mp3", ".flac", ".ogg", ".wav", ".m4a", ".aac", ".webm"}
    image_exts = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}
    for entry in sorted(os.listdir(bgm_root)):
        folder_path = os.path.join(bgm_root, entry)
        if not os.path.isdir(folder_path):
            continue
        folder_name, folder_artist, folder_has_metadata = parse_track_metadata(entry, "／")
        name = folder_name
        artist = folder_artist
        normalized_entry = normalize_path_component(entry)
        audio_path = None
        cover_path = None
        for file_name in os.listdir(folder_path):
            file_path = os.path.join(folder_path, file_name)
            if not os.path.isfile(file_path):
                continue
            normalized_file_name = normalize_path_component(file_name)
            ext = os.path.splitext(file_name)[1].lower()
            if ext in image_exts:
                if cover_path is None:
                    cover_path = "./static/bgm/{}/{}".format(
                        normalized_entry, normalized_file_name
                    )
            elif ext in audio_exts:
                if audio_path is None:
                    audio_path = "./static/bgm/{}/{}".format(
                        normalized_entry, normalized_file_name
                    )
                    stem = os.path.splitext(normalized_file_name)[0]
                    if folder_has_metadata:
                        continue
                    parsed_name, parsed_artist, has_metadata = parse_track_metadata(stem, "_")
                    if has_metadata:
                        name = parsed_name
                        artist = parsed_artist
        if audio_path:
            result.append(
                {
                    "name": name,
                    "artist": artist,
                    "url": audio_path,
                    "cover": cover_path or "",
                }
            )
    return result


def main():
    playlist = scan_bgm_root()
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(base_dir, "static", "bgm", "playlist.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(playlist, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
