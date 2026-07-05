const Notification = import('../models/Notification');

exports.sendNotification = async (userId, message) => {
  try {
    await Notification.create({ userId, message });
  } catch (err) {
    console.error("Failed to send notification:", err);
  }
};