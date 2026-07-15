module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('Review', ['university_id'], {
      name: 'idx_review_university',
    });
    await queryInterface.addIndex('Review', ['user_id'], {
      name: 'idx_review_user',
    });
    await queryInterface.addIndex('Comment', ['review_id'], {
      name: 'idx_comment_review',
    });
    await queryInterface.addIndex('Comment', ['user_id'], {
      name: 'idx_comment_user',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Review', 'idx_review_university');
    await queryInterface.removeIndex('Review', 'idx_review_user');
    await queryInterface.removeIndex('Comment', 'idx_comment_review');
    await queryInterface.removeIndex('Comment', 'idx_comment_user');
  },
};
