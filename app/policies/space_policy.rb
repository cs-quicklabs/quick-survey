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
    new? and record.archive?
  end

  def pin?
    (record.users.include?(user) or !user.member?) and !user.pinned_spaces.pluck(:space_id).include?(record.id) and !record.archive
  end

  def unpin?
    (record.users.include?(user) or !user.member?) and user.pinned_spaces.pluck(:space_id).include?(record.id) and !record.archive
  end
end
