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
    folder = record.last
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

  def change
    space = record.first
    space.users.include?(user) || space.user == user
  end

  def change_folder?
    true
  end

  def folders?
    true
  end

  def pin?
    space = record.first
    (space.users.include?(user) || space.user == user) && !space.archive
  end

  def unpin?
    space = record.rist
    (space.users.include?(user) || space.user == user) && !space.archive && user.pinned_spaces.include?(space)
  end
end
