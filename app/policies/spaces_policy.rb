class SpacesPolicy < Struct.new(:user, :spaces)
  def index?
    true
  end

  def create?
    true
  end

  def new?
    true
  end
end
