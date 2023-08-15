class SpacePolicy < ApplicationPolicy
  def index?
    true
  end

  def edit?
    record.user == user && !record.archive
  end

  def update?
    edit?
  end

  def destroy?
    record.user == user
  end

  def archive?
    edit?
  end

  def unarchive?
    record.user == user && record.archive
  end

  def pin?
    !record.archive?
  end

  def unpin?
    user.pinned.include?(record)
  end
end
