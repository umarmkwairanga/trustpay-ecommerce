// A simple form that sends data to your new 'SupportTickets' collection
const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/support/ticket', { subject, message });
    alert("Support request submitted. We'll contact you shortly.");
};