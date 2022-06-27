export default function messageCleaner(str) {
    return str.substring(str.lastIndexOf(':') + 1, str.length).trim();
}