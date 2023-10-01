class SpacePolicy < ApplicationPolicy
  def index?
    true
  end

  def new?
    !user.member?
  end

  def create?
    new?
  end

  def edit?
    new? && !record.archive?
  end

  def update?
    edit?
  end

  def destroy?
    new? and record.archive?
  end

  def archive?
    edit?
  end

  def unarchive?
    edit?
  end

  def pin?
    record.users.include?(user) and user.pinned_spaces.include?(record) and !record.archive
  end

  def unpin?
    user.pinned_spaces.include?(record) and record.users.include?(user) and !record.archive
  end
end
