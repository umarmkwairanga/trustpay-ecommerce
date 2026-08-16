class SettingsService {
  async validateStaffUpdate(targetUser, updateData, requester) {
    if (targetUser.role === 'staff' && requester.id === targetUser._id.toString()) {
      // Staff cannot change their own permissions or roles
      delete updateData.permissions;
      delete updateData.role;
      delete updateData.status;
    }
    return updateData;
  }
}

module.exports = new SettingsService();