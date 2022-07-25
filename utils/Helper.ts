const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
export default {
    getNextDate(startDate: Date): Date {
        const startDateCopy = new Date(startDate.getTime());
        const dateNow = new Date();
        while (startDateCopy < dateNow) {
            // Pretty inefficient
            startDateCopy.setFullYear(startDateCopy.getFullYear() + 1);
        }
        return startDateCopy;
    },
    getDaysToAge(startDate: Date): { days: number; age: number, month: number, monthName: string, date: number } {
        const nextOccurrence = this.getNextDate(startDate);
        const todayDate = new Date();
        const millisecondsDifference = nextOccurrence.getTime() - todayDate.getTime();
        const daysDifference = Math.ceil(
            millisecondsDifference / (1000 * 60 * 60 * 24)
        );
        const age = nextOccurrence.getFullYear() - startDate.getFullYear();

        return {
            days: daysDifference,
            age,
            month: nextOccurrence.getMonth() + 1,
            monthName: monthNames[nextOccurrence.getMonth()],
            date: nextOccurrence.getDate()
        };
    }
}