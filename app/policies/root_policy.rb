class RootPolicy < Struct.new(:user, :root)
  def index?
    true
  end
end
