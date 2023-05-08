class Space::FolderPolicy < Space::BaseSpacePolicy
  def index?
    space = record.first
    space.users.include?(user) || space.user == user
  end

  def new?
    space = record.first
    return false if space.archive
    space.users.include?(user)
  end

  def create?
    new?
  end

  def show?
    space = record.first
    message = record.last
    message.published? ? space.users.include?(user) : message.user == user
  end

  def comment?
    show? && !record.first.archive
  end

  def edit?
    space = record.first
    space.users.include?(user) && !space.archive
  end

  def update?
    edit?
  end

  def destroy?
    edit?
  end

  def publish?
    space = record.first
    message = record.last
    space.users.include?(user) && !space.archive && !message.published?
  end

  def delete_draft?
    message = record.last
    message.user == user && !message.published?
  end

  def draft?
    space = record.first
    message = record.last
    space.users.include?(user) && !message.published?
  end

  def edit_comment?
    !record.first.archive?
  end

  def destroy_comment?
    !record.first.archive? and record.first.user == user
  end
end
