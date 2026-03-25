export const professionals = [
    {
        id: 1,
        name: 'Dr. Alicio da Silva',
        specialty: 'Cardiologia',
    },
    {
        id: 2,
        name: 'Dra. Ana Pereira',
        specialty: 'Dermatologia',
    },
    {
        id: 3,
        name: 'Dra. Carol Gomes',
        specialty: 'Neurologia',
    },
];

function getSeedAppointments() {
    const today = new Date();
    const todayAtElevenAM = new Date(today);
    todayAtElevenAM.setHours(11, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowAtTwoPM = new Date(tomorrow);
    tomorrowAtTwoPM.setHours(14, 0, 0, 0);

    return [
        {
            date: todayAtElevenAM.toISOString(),
            patientName: 'Joao da Silva',
            reason: 'check-up regular',
            professionalId: professionals[0].id
        },
        {
            date: tomorrowAtTwoPM.toISOString(),
            patientName: 'Luana Costa',
            reason: 'Erupção cutânea',
            professionalId: professionals[1].id
        },
    ];
}

export class AppointmentService {
    private appointments = getSeedAppointments();

    getAppointmentsForProfessional(professionalId: number, date: Date, patientName?: string) {
        return this.appointments.find(appointment =>
            appointment.professionalId === professionalId &&
            new Date(appointment.date).getTime() === date.getTime() &&
            (!patientName || appointment.patientName === patientName)
        );
    }

    checkAvailability(professionalId: number, date: Date): boolean {
        const alreadyBooked = this.getAppointmentsForProfessional(professionalId, date);
        return !alreadyBooked;
    }

    bookAppointment(professionalId: number, date: Date, patientName: string, reason: string) {
        if (!this.checkAvailability(professionalId, date)) {
            throw new Error('Horário indisponível para este profissional');
        }

        const newAppointment = {
            date: date.toISOString(),
            patientName,
            reason,
            professionalId
        };

        this.appointments.push(newAppointment);
        return newAppointment;
    }

    cancelAppointment(professionalId: number, patientName: string, date: Date) {
        const hasBooked = this.getAppointmentsForProfessional(professionalId, date, patientName);
        if (!hasBooked) {
            throw new Error('Agendamento não encontrado para cancelamento');
        }

        const index = this.appointments.indexOf(hasBooked);
        this.appointments.splice(index, 1);
    }
}
