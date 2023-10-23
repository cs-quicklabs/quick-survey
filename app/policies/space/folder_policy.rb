class Space::FolderPolicy < Space::BaseSpacePolicy
  def index?
    space = record.first
    space.users.include?(user) || space.user == user
  end

  def new?
    !user.member?
  end

  def create?
    new?
  end

  def show?
    index?
  end

  def edit?
    new?
  end

  def update?
    edit?
  end

  def destroy?
    edit?
  end

  def change
    edit?
  end

  def change_folder?
    edit?
  end

  def folders?
    edit?
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
