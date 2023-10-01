class SpacesPolicy < Struct.new(:user, :spaces)
  def index?
    !user.member?
  end

  def create?
    index?
  end

  def new?
    index?
  end
end
