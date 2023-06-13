class Space::FolderPolicy < Space::BaseSpacePolicy
  def index?
    #space = record.first
    #space.users.include?(user) || space.user == user
    true
  end

  def new?
    #space = record.first
    #return false if space.archive
    #space.users.include?(user)
    true
  end

  def create?
    new?
  end

  def show?
    #space = record.first
    #message = record.last
    #message.published? ? space.users.include?(user) : message.user == user
    true
  end

  def comment?
    #show? && !record.first.archive
    true
  end

  def edit?
    #space = record.first
    #space.users.include?(user) && !space.archive
    true
  end

  def update?
    edit?
  end

  def destroy?
    edit?
  end

  def publish?
    #space = record.first
    #message = record.last
    #space.users.include?(user) && !space.archive && !message.published?
    true
  end

  def delete_draft?
    message = record.last
    message.user == user && !message.published?
  end

  def draft?
    #space = record.first
    #message = record.last
    #space.users.include?(user) && !message.published?
    true
  end

  def edit_comment?
    #!record.first.archive?
    true
  end

  def destroy_comment?
    #!record.first.archive? and record.first.user == user
    true
  end

  def folders?
    true
  end

  def change_folder?
    true
  end
end
