require "application_system_test_case"

class UserTest < ApplicationSystemTestCase
  setup do
    @user = users(:admin)
    sign_in @user
    @member = users(:member)
  end

  def page_url
    users_url
  end

  def users_page_url
    user_attempts_url(user_id: @member.id)
  end

  test "can visit users page if logged in" do
    visit page_url
    take_screenshot
    assert_selector "h1", text: "Users"
  end

  test "can not users page if not logged in" do
    sign_out @user
    visit page_url
    assert_selector "h1", text: "Sign in to your account"
  end

  test "can visit user detail page" do
    visit users_page_url
    take_screenshot
    assert_selector "h1", text: @member.decorate.display_name
  end

  test "can edit user detail" do
    visit page_url
    within "tr##{dom_id(@member)}" do
      click_on "Edit"
    end
    fill_in "First Name", with: "New"
    fill_in "Last Name", with: "member"
    click_on "Save"
    assert_text "User has been updated successfully"
  end

  test "can not edit user detail with empty  email" do
    visit page_url
    within "tr##{dom_id(@member)}" do
      click_on "Edit"
    end
    fill_in "Email", with: ""
    click_on "Save"
    take_screenshot
    assert_text "Email can't be blank"
  end

  test "can not edit user with duplicate email" do
    visit page_url
    within "tr##{dom_id(@member)}" do
      click_on "Edit"
    end
    fill_in "Email", with: ""
    fill_in "Email", with: users(:actor).email
    click_on "Save"
    take_screenshot
    assert_text "Email has already been taken"
  end

  test "can deactivate user" do
    visit page_url
    actor = users(:actor)
    within "tr##{dom_id(actor)}" do
      click_on "Deactivate"
    end
    assert_text "User has been deactivated."
  end

  test "can activate user" do
    visit deactivated_users_path
    deactivated = users(:deactivated)
    within "tr##{dom_id(deactivated)}" do
      click_on "Activate"
    end
    assert_text "User has been activated."
  end

  test "can delete deactivated user" do
    visit deactivated_users_path
    deactivated = users(:deactivated)
    within "tr##{dom_id(deactivated)}" do
      page.accept_confirm do
        click_on "Delete"
      end
    end
    assert_text "User has been deleted."
  end
end
