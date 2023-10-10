class SpacesPolicy < Struct.new(:user, :spaces)
  def index?
    true
  end

  def create?
    !user.member?
  end

  def new?
    !user.member?
  end
end
