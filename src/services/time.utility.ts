export const TimeUtility = {
    getFormattedTime: (date: Date) => {
        const now = new Date();

        const diff = now.getTime() - date.getTime();

        if (diff < 1000) {
            return 'just now';
        } else if (diff < 1000 * 60) {
            return `${Math.floor(diff / 1000)} seconds ago`;
        } else if (diff < 1000 * 60 * 60) {
            return `${Math.floor(diff / (1000 * 60))} minutes ago`;
        } else if (date.getDay() === now.getDay() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
            return `Today at ${date.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}`;
        } else if (diff < 1000 * 60 * 60 * 48) {
            return `Yesterday at ${date.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}`;
        } else {
            return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}`
        }

    }

}