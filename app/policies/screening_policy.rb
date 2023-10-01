class ScreeningPolicy < Struct.new(:user, :screening)
  def index?
    !user.member?
  end
end
