require "application_system_test_case"

class UserTest < ApplicationSystemTestCase
  setup do
    @user = users(:admin)
    @account = @user.account
    ActsAsTenant.current_tenant = @account
    sign_in @user
    @member = users(:member)
  end

  def page_url
    users_url(script_name: "/#{@account.id}")
  end

  def users_page_url
    user_attempts_url(script_name: "/#{@account.id}", user_id: @member.id)
  end

  test "admin can create view all users" do
    visit page_url
    assert_selector "h1", text: "Users"
    assert_text "Invite New User"
    user = users(:member)
    within "tr##{dom_id(user)}" do
      assert_text user.email
      assert_text "member"
      assert_text "Invited"
      assert_text "View"
      assert_text "Edit"
      assert_text "Deactivate"
      assert_text "Resend Invitation"
    end
  end
  test " super admin can create view all users" do
    login_as users(:super_admin)
    visit page_url
    assert_selector "h1", text: "Users"
    assert_text "Invite New User"
    user = users(:member)
    within "tr##{dom_id(user)}" do
      assert_text user.email
      assert_text "member"
      assert_text "Invited"
      assert_text "View"
      assert_text "Edit"
      assert_text "Deactivate"
      assert_text "Resend Invitation"
    end
  end

  test "member can not create view all users" do
    login_as users(:member)
    visit page_url
    assert_current_path(dashboard_path(script_name: "/#{@account.id}"))
    assert_no_text "Users"
  end

  test "admin can view user details" do
    visit users_page_url
    within "#user-header" do
      assert_text @member.decorate.display_name
      assert_text "Edit"
      assert_text "Deactivate"
    end
    within "#user-tabs" do
      assert_text "Attempts"
      assert_text "Spaces"
    end
    @member = users(:admin)
    visit user_attempts_url(script_name: "/#{users(:admin).account.id}", user_id: @member)
    within "#user-header" do
      assert_text @member.decorate.display_name
      assert_text "Edit"
      assert_text "Deactivate"
    end
    within "#user-tabs" do
      assert_text "Attempts"
      assert_text "Surveys"
      assert_text "Spaces"
    end
  end
  test "super admin can view user details" do
    login_as users(:super_admin)
    visit users_page_url
    within "#user-header" do
      assert_text @member.decorate.display_name
      assert_text "Edit"
      assert_text "Deactivate"
    end
    within "#user-tabs" do
      assert_text "Attempts"
      assert_text "Spaces"
    end
    @member = users(:admin)
    visit user_attempts_url(script_name: "/#{users(:admin).account.id}", user_id: @member)
    within "#user-header" do
      assert_text @member.decorate.display_name
      assert_text "Edit"
      assert_text "Deactivate"
    end
    within "#user-tabs" do
      assert_text "Attempts"
      assert_text "Surveys"
      assert_text "Spaces"
    end
  end

  test "admin can see archived surveys and spaces" do
    @member = users(:admin)
    visit users_page_url
    within "#user-tabs" do
      click_on "Spaces"
    end
    @archived_space = spaces(:archived)
    assert_no_text @archived_space.title
    within "#user-tabs" do
      click_on "Surveys"
    end
    @archived_survey = survey_surveys(:archived)
    assert_no_text @archived_survey.name
  end
end
